import { Stats } from 'simulator/entity/player/stats'
import { DamageInstance } from 'simulator/damage'
import { JobInfo } from 'data/jobs'
import * as Funcs from './functions'
import { JOB_MODS } from './modifiers/job'
import { Level } from './modifiers/level'
import { PET_MODS } from './modifiers/pet'

const PARTY_BONUS = 1.05  // assume the full 5% buff

function fl(x: number) { return Math.floor(x) }

 /**
 * @param trait - IAD, M&M, etc (20% trait = 120)
 */
function baseDamage(potency: number, partyBonus: number, trait: number, jobMod_att: number, level: Level, stats: Stats)
{
    // TODO select main stat other than dex
    const mainstat = fl(stats.dexterity * partyBonus)

    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(mainstat)
    const tnc = 1000 // TODO tanks
    const wd = Funcs.fWD(stats.weapondamage, level, jobMod_att)

    const d1 = fl( fl( fl(potency * ap * det) / 100 ) / 1000)
    const d2 = fl( fl( fl( fl( fl( fl(d1 * tnc) / 1000 ) * wd ) / 100 ) * trait) / 100)

    return d2
}

function baseDoTDamage(potency: number, trait: number, jobMod_att: number, level: Level, stats: Stats)
{
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(stats.dexterity)
    const tnc = 1000 // TODO
    const spd = Funcs.fSPD(stats.skillspeed, level) // TODO speed
    const wd = Funcs.fWD(stats.weapondamage, level, jobMod_att)

    const d1 = fl( fl( fl(potency * ap * det) / 100 ) / 1000)
    const d2 = fl( fl( fl( fl( fl( fl( fl( fl(d1 * tnc) / 1000 ) * spd) / 1000) * wd ) / 100 ) * trait) / 100) + 1

    // TODO different formula for magical DoTs

    return d2
}

function baseAutoDamage(potency: number, trait: number, delay: number, jobMod_att: number, level: Level, stats: Stats)
{
    const det = Funcs.fDET(stats.determination, level)
    const ap = Funcs.fAP(stats.dexterity)
    const tnc = 1000 // TODO
    const spd = Funcs.fSPD(stats.skillspeed, level) // TODO speed
    const auto = Funcs.fAUTO(stats.weapondamage, delay, level, jobMod_att)

    const d1 = fl( fl( fl(potency * ap * det) / 100 ) / 1000)
    const d2 = fl( fl( fl( fl( fl( fl( fl( fl(d1 * tnc) / 1000 ) * spd) / 1000) * auto ) / 100 ) * trait) / 100)

    return d2
}

export function expectedDamage(hit: DamageInstance, job: JobInfo, level: Level, stats: Stats)
{
    let damage = 0
    let newstats = {...stats}

    // Apply mainstat buffs
    hit.buffs.forEach(buff => {
        newstats.dexterity += buff.mainStat ?? 0
    })

    // Get base damage depending on the type of the hit
    const attribute = job.damageMap[hit.type]

    let jobMod_att = JOB_MODS[job.name][attribute]
    let trait = job.trait
    let partyBonus = PARTY_BONUS

    const pet = hit.options.pet
    if (pet && pet in PET_MODS) {
        jobMod_att = PET_MODS[pet][attribute] ?? jobMod_att
        trait = PET_MODS[pet].trait ?? trait
        partyBonus = 1  // pets don't get the party bonus
    }

    if (hit.type === 'Ability' || hit.type === 'Spell' || hit.type === 'Weaponskill') {
        damage = baseDamage(hit.potency, partyBonus, trait, jobMod_att, 80, newstats)

    } else if (hit.type === 'DoT') {
        damage = baseDoTDamage(hit.potency, trait, jobMod_att, 80, newstats)
    
    } else if (hit.type === 'Auto') {
        damage = baseAutoDamage(hit.potency, trait, job.weaponDelay, jobMod_att, 80, newstats)
    }

    // Apply damage falloff (for AoEs)
    if (hit.falloff) {
        damage = fl( damage * (1 - hit.falloff) )
    }

    // Apply multiplier buffs
    hit.buffs.forEach(buff => {
        damage = fl( damage * (buff.potency ?? 1) )
    })

    let critRate = Funcs.critRate(newstats.critical, level) / 100
    let directRate = Funcs.dhRate(newstats.direct, level) / 100

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
