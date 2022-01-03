import { JobInfo } from 'data/jobs'
import { DamageInstance } from 'simulator/damage'
import { Stats } from 'simulator/gear/stats'
import * as Funcs from './functions'
import { Attribute, JOB_MODS } from './modifiers/job'
import { Level } from './modifiers/level'
import { PET_MODS } from './modifiers/pet'

const PARTY_BONUS = 1.05  // assume the full 5% buff

function fl(x: number) { return Math.floor(x) }

/**
 * @param trait - IAD, M&M, etc (20% trait = 120)
 */
function baseDamage(potency: number, mainstat: number, trait: number, jobMod_att: number, level: Level, stats: Stats) {
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat, level)
    const tnc = 1000 // TODO tanks
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * wd) / 100) * trait) / 100)

    return d2
}

function baseDoTDamage(potency: number, mainstat: number, trait: number, jobMod_att: number, level: Level, stats: Stats) {
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat, level)
    const tnc = 1000 // TODO
    const spd = Funcs.fSPD(stats.skillspeed, level) // TODO speed
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * spd) / 1000) * wd) / 100) * trait) / 100) + 1

    // TODO different formula for magical DoTs (I guess just BLM now...)

    return d2
}

function baseAutoDamage(potency: number, mainstat: number, delay: number, jobMod_att: number, level: Level, stats: Stats) {
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat, level)
    const tnc = 1000 // TODO
    const spd = Funcs.fSPD(stats.skillspeed, level) // TODO speed
    const auto = Funcs.fAUTO(stats.weaponDamage, delay, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * spd) / 1000) * auto) / 100)

    return d2
}

export function expectedDamage(hit: DamageInstance, job: JobInfo, level: Level, stats: Stats) {
    let damage = 0
    const newstats = {...stats}

    // Get base damage depending on the type of the hit
    const attribute = job.damageMap[hit.type]

    let mainStat: keyof Stats
    if (attribute === Attribute.STR) {
        mainStat = 'strength'
    } else if (attribute === Attribute.DEX) {
        mainStat = 'dexterity'
    }

    // Apply mainstat buffs
    hit.buffs.forEach(buff => {
        newstats[mainStat] += buff.mainStat ?? 0
    })

    let jobMod_att = JOB_MODS[job.job][attribute]
    let trait = job.trait
    let partyBonus = PARTY_BONUS

    const pet = hit.options.pet
    if (pet && pet in PET_MODS) {
        jobMod_att = PET_MODS[pet][attribute] ?? jobMod_att
        trait = PET_MODS[pet].trait ?? trait
        partyBonus = 1  // pets don't get the party bonus
    }

    const main = fl(newstats[mainStat] * partyBonus)

    if (hit.type === 'Ability' || hit.type === 'Spell' || hit.type === 'Weaponskill') {
        damage = baseDamage(hit.potency, main, trait, jobMod_att, 90, newstats)

    } else if (hit.type === 'DoT') {
        damage = baseDoTDamage(hit.potency, main, trait, jobMod_att, 90, newstats)

    } else if (hit.type === 'Auto') {
        damage = baseAutoDamage(hit.potency, main, job.weaponDelay, jobMod_att, 90, newstats)
    }

    // Apply damage falloff (for AoEs)
    if (hit.falloff) {
        damage = fl(damage * (1 - hit.falloff))
    }

    // Apply multiplier buffs
    hit.buffs.forEach(buff => {
        damage = fl(damage * (buff.potency ?? 1))
    })

    let critRate = Funcs.critRate(newstats.critical, level)
    let directRate = Funcs.dhRate(newstats.direct, level)

    // Apply rate buffs
    hit.buffs.forEach(buff => {
        critRate += buff.critRate ?? 0
        directRate += buff.directRate ?? 0
    })

    critRate = Math.min(critRate, 1)
    directRate = Math.min(directRate, 1)

    if (hit.options.noCrit) {
        critRate = 0
    }
    if (hit.options.noDirect) {
        directRate = 0
    }

    const critMult = Funcs.fCRIT(newstats.critical, level) / 1000
    const dhMult = 1.25

    return damage * (1 - critRate) * (1 - directRate) +
           damage * (critRate) * (1 - directRate) * critMult +
           damage * (1 - critRate) * (directRate) * dhMult +
           damage * (critRate) * (directRate) * critMult * dhMult
}
