import { JobInfo } from 'data/jobs'
import { DamageInstance } from 'simulator/damage'
import { Stats } from 'simulator/gear/stats'
import * as Funcs from './functions'
import { Attribute, JOB_MODS } from './modifiers/job'
import { Level } from './modifiers/level'
import { PET_MODS } from './modifiers/pet'

const PARTY_BONUS = 1.05  // assume the full 5% buff
const DH_MULT = 1.25

function fl(x: number) { return Math.floor(x) }

/**
 * @param trait - IAD, M&M, etc (20% trait = 120)
 */
function baseDamage(
    potency: number,
    mainstat: number,
    trait: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
): number {
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat, level)
    const tnc = 1000 // TODO tanks
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * wd) / 100) * trait) / 100)

    return d2
}

function autoCDHDamage(
    potency: number,
    mainstat: number,
    trait: number,
    buffCritRate: number,
    buffDHRate: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
): number {
    // Auto crit stuff using Mahdi's janky formulas
    const pot = potency / 100
    const ap = Funcs.fAP(mainstat, level) / 100
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)
    const det = Funcs.fDET(stats.determination, level) / 1000
    const dh = Funcs.fDHAuto(stats.direct, level) / 1000
    const det_dh = fl((det + dh - 1) * 1000) / 1000
    const tnc = 1000 / 1000 // TODO tanks
    const crit = Funcs.fCRIT(stats.critical, level) / 1000

    const d1 = fl(pot * ap * 100) / 100
    const d2 = fl(d1 * det_dh * 100) / 100
    const d3 = fl(d2 * tnc * 100) / 100
    const d4 = fl(d3 * wd)
    const d5 = fl(fl(d4 * crit) * DH_MULT)
    const d6 = fl(d5 * (1 + (buffCritRate * (crit - 1))))
    const d7 = fl(d6 * (1 + (buffDHRate * (DH_MULT - 1))))
    const d8 = fl(fl(d7 * trait) / 100)

    return d8
}

function baseDoTDamage(
    potency: number,
    mainstat: number,
    trait: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
): number {
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat, level)
    const tnc = 1000 // TODO
    const spd = Funcs.fSPD(stats.skillspeed, level) // TODO speed
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * spd) / 1000) * wd) / 100) * trait) / 100) + 1

    // TODO different formula for magical DoTs
    return d2
}

function baseAutoDamage(
    potency: number,
    mainstat: number,
    delay: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
): number {
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
        newstats[mainStat] -= Funcs.attribute(90, JOB_MODS[job.job][attribute]) - Funcs.attribute(90, jobMod_att)
    }

    const potency = fl(hit.potency * (1 - (hit.falloff ?? 0)))

    const main = fl(newstats[mainStat] * partyBonus)

    const critRate = Funcs.critRate(newstats.critical, level)
    const directRate = Funcs.dhRate(newstats.direct, level)

    let buffCritRate = 0
    let buffDHRate = 0

    // Apply rate buffs
    hit.buffs.forEach(buff => {
        buffCritRate += buff.critRate ?? 0
        buffDHRate += buff.directRate ?? 0
    })

    // TODO auto crits without auto DH
    if (hit.options.critType && hit.options.dhType && hit.options.critType === 'auto' && hit.options.dhType === 'auto') {
        damage = autoCDHDamage(potency, main, trait, buffCritRate, buffDHRate, jobMod_att, 90, newstats)

        hit.buffs.forEach(buff => {
            damage = fl(damage * (buff.potency ?? 1))
        })

        return damage
    }

    if (hit.type === 'Ability' || hit.type === 'Spell' || hit.type === 'Weaponskill') {
        damage = baseDamage(potency, main, trait, jobMod_att, 90, newstats)

    } else if (hit.type === 'DoT') {
        damage = baseDoTDamage(potency, main, trait, jobMod_att, 90, newstats)

    } else if (hit.type === 'Auto') {
        damage = baseAutoDamage(potency, main, job.weaponDelay, jobMod_att, 90, newstats)
    }

    // Apply multiplier buffs
    hit.buffs.forEach(buff => {
        damage = fl(damage * (buff.potency ?? 1))
    })

    const critMult = Funcs.fCRIT(newstats.critical, level) / 1000

    return damage * (1 + (critMult - 1) * (critRate + buffCritRate)) * (1 + (DH_MULT - 1) * (directRate + buffDHRate))
}
