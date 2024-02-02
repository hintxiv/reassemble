import { JobInfo } from 'data/jobs'
import { DamageInstance } from 'simulator/damage'
import { Stats } from 'simulator/gear/stats'
import * as Funcs from './functions'
import { Attribute, JOB_MODS } from './modifiers/job'
import { Level } from './modifiers/level'
import { PET_MODS } from './modifiers/pet'

const PARTY_BONUS = 1.05  // assume the full 5% buff
const DH_MULT = 1.25

const fl = (x: number) => Math.floor(x)

/**
 * @param potency - potency of the hit
 * @param mainstat - main stat (dex/agi/int/...) total (incl. party bonus, tincture, and other buffs)
 * @param trait - IAD, M&M, etc (20% trait = 120)
 * @param buffCritRate - total crit rate from buffs
 * @param buffDHRate - total DH rate from buffs
 * @param jobMod_att - "attribute" (main stat) job modifier
 * @param level - player's current level (not all levels are supported...)
 * @param stats - Stats object (from gearset + food)
 * @param autoCrit - true if this hit is a guaranteed critical hit
 * @param autoDH - true if this hit is a guaranteed direct hit
 */
function baseDamage(
    potency: number,
    mainstat: number,
    trait: number,
    buffCritRate: number,
    buffDHRate: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
    autoCrit: boolean,
    autoDH: boolean,
): number {
    const pot = potency / 100
    const ap = Funcs.fAP(mainstat, level) / 100
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)
    const det = Funcs.fDET(stats.determination, level) / 1000
    const dh = Funcs.fDHAuto(stats.direct, level) / 1000
    const det_dh = fl((det + dh - 1) * 1000) / 1000
    const tnc = 1000 / 1000 // TODO tanks
    const crit = Funcs.fCRIT(stats.critical, level) / 1000

    const d1 = fl(pot * ap * 100) / 100
    const d2 = fl(d1 * (autoDH ? det_dh : det) * 100) / 100
    const d3 = fl(d2 * tnc * 100) / 100
    const d4 = fl(d3 * wd)
    const d5 = autoCrit ? fl(fl(crit * d4) * (1 + (buffCritRate * (crit - 1)))) : d4
    const d6 = autoDH ? fl(fl(DH_MULT * d5) * (1 + (buffDHRate * (DH_MULT - 1)))) : d5
    const d7 = fl(fl(d6 * trait) / 100)

    return d7
}

function physicalDoTDamage(
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
    const spd = Funcs.fSPD(stats.skillspeed, level)
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * spd) / 1000) * wd) / 100) * trait) / 100) + 1

    return d2
}

function magicalDoTDamage(
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
    const spd = Funcs.fSPD(stats.spellspeed, level)
    const wd = Funcs.fWD(stats.weaponDamage, level, jobMod_att)

    const d1 = fl(fl(fl(fl((fl(potency * wd) / 100)) * ap) * spd) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(d1 * det) / 1000) * tnc) / 1000) * trait) / 100) + 1

    return d2
}

function baseDoTDamage(
    type: 'magical' | 'physical',
    potency: number,
    mainstat: number,
    trait: number,
    jobMod_att: number,
    level: Level,
    stats: Stats,
): number {
    switch (type) {
    case 'physical':
        return physicalDoTDamage(potency, mainstat, trait, jobMod_att, level, stats)
    case 'magical':
        return magicalDoTDamage(potency, mainstat, trait, jobMod_att, level, stats)
    }
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
    const spd = Funcs.fSPD(stats.skillspeed, level)
    const auto = Funcs.fAUTO(stats.weaponDamage, delay, level, jobMod_att)

    const d1 = fl(fl(fl(potency * ap * det) / 100) / 1000)
    const d2 = fl(fl(fl(fl(fl(fl(d1 * tnc) / 1000) * spd) / 1000) * auto) / 100)

    return d2
}

function getDoTType(job: JobInfo): 'physical' | 'magical' {
    switch (job.mainStat) {
    case Attribute.DEX:
    case Attribute.STR:
        return 'physical'
    case Attribute.INT:
    case Attribute.MND:
        return 'magical'
    }
}

function getMainStatKey(attribute: Attribute): keyof Stats {
    switch (attribute) {
    case Attribute.STR:
        return 'strength'
    case Attribute.DEX:
        return 'dexterity'
    case Attribute.INT:
        return 'intelligence'
    case Attribute.MND:
        return 'mind'
    }
}

export function expectedDamage(hit: DamageInstance, job: JobInfo, level: Level, stats: Stats) {
    let damage = 0
    const newstats = {...stats}

    const attribute = job.damageMap[hit.type]
    const mainStat = getMainStatKey(attribute)

    // Apply mainstat buffs
    hit.buffs.forEach(buff => newstats[mainStat] += buff.mainStat ?? 0)

    let attributeJobMod = JOB_MODS[job.job][attribute]
    let trait = job.trait
    let partyBonus = PARTY_BONUS

    const pet = hit.options.pet
    if (pet && pet in PET_MODS) {
        attributeJobMod = PET_MODS[pet][attribute] ?? attributeJobMod
        trait = PET_MODS[pet].trait ?? trait
        partyBonus = 1  // pets don't get the party bonus
        newstats[mainStat] -= Funcs.attribute(level, JOB_MODS[job.job][attribute]) - Funcs.attribute(level, attributeJobMod)
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

    const autoCrit = hit.options.critType && hit.options.critType === 'auto'
    const autoDH = hit.options.dhType && hit.options.dhType === 'auto'

    if (hit.type === 'Ability' || hit.type === 'Spell' || hit.type === 'Weaponskill') {
        damage = baseDamage(potency, main, trait, buffCritRate, buffDHRate, attributeJobMod, level, newstats, autoCrit, autoDH)
    } else if (hit.type === 'DoT') {
        const dotType = getDoTType(job)
        damage = baseDoTDamage(dotType, potency, main, trait, attributeJobMod, level, newstats)
    } else if (hit.type === 'Auto') {
        damage = baseAutoDamage(potency, main, job.weaponDelay, attributeJobMod, level, newstats)
    }

    // Apply multiplier buffs
    hit.buffs.forEach(buff => damage = fl(damage * (buff.potency ?? 1)))

    // Apply expected multiplier from crit
    if (!autoCrit) {
        const critMult = Funcs.fCRIT(newstats.critical, level) / 1000
        damage *= (1 + (critMult - 1) * (critRate + buffCritRate))
    }

    // Apply expected multiplier from DH
    if (!autoDH) {
        damage *= (1 + (DH_MULT - 1) * (directRate + buffDHRate))
    }

    return damage
}
