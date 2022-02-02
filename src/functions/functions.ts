import { Level, LEVEL_MODS } from './modifiers/level'

/**
 * All functions are sourced from Allagan Studies:
 * https://www.akhmorning.com/allagan-studies/how-to-be-a-math-wizard/shadowbringers/functions/
 */

export function fWD(wd: number, level: Level, jobMod_att: number) {
    const lvlMod_main = LEVEL_MODS[level].MAIN

    return Math.floor((lvlMod_main * jobMod_att / 1000) + wd)
}

export function attribute(level: Level, jobMod_att: number) {
    const lvlMod_main = LEVEL_MODS[level].MAIN

    // Hidden trait needed here?
    return Math.floor(lvlMod_main * (jobMod_att / 100))
}

// Works for 90 and non-tank only! TODO
export function fAP(ap: number, level: Level) {
    const lvlMod_main = LEVEL_MODS[level].MAIN

    return Math.floor(195 * (ap - lvlMod_main) / lvlMod_main) + 100
}

export function fDET(det: number, level: Level) {
    const lvlMod_main = LEVEL_MODS[level].MAIN
    const lvlMod_div = LEVEL_MODS[level].DIV

    return Math.floor(140 * ((det - lvlMod_main) / lvlMod_div) + 1000)
}

// export function fTNC(/* ... */) TODO

export function fSPD(spd: number, level: Level) {
    const lvlMod_sub = LEVEL_MODS[level].SUB
    const lvlMod_div = LEVEL_MODS[level].DIV

    return Math.floor(130 * ((spd - lvlMod_sub) / lvlMod_div) + 1000)
}

// Computes base (2.50 action before speedmods) GCD recast (in ms) from speed stat
export function fGCD(spd: number, level: Level) {
    const gcd1 = Math.floor((2000 - fSPD(spd, level)) * 2.5)

    return Math.floor(gcd1 / 10) * 10
}

export function fCRIT(crit: number, level: Level) {
    const lvlMod_sub = LEVEL_MODS[level].SUB
    const lvlMod_div = LEVEL_MODS[level].DIV

    return Math.floor(200 * ((crit - lvlMod_sub) / lvlMod_div) + 1400)
}

export function critRate(crit: number, level: Level) {
    const lvlMod_sub = LEVEL_MODS[level].SUB
    const lvlMod_div = LEVEL_MODS[level].DIV

    return Math.floor((200 * (crit - lvlMod_sub) / lvlMod_div) + 50) / 1000
}

export function critModFromRate(critRate: number, level: Level) {
    const lvlMod_sub = LEVEL_MODS[level].SUB
    const lvlMod_div = LEVEL_MODS[level].DIV

    // We can't recover the exact crit stat, but we can get the tier
    const critTier = ((((critRate * 1000) - 50) / 200) * lvlMod_div) + lvlMod_sub

    return fCRIT(critTier, level) / 1000
}

export function dhRate(dh: number, level: Level) {
    const lvlMod_sub = LEVEL_MODS[level].SUB
    const lvlMod_div = LEVEL_MODS[level].DIV

    return Math.floor((550 * (dh - lvlMod_sub)) / lvlMod_div) / 1000
}

export function fAUTO(wd: number, delay: number, level: Level, jobMod_att: number) {
    const lvlMod_main = LEVEL_MODS[level].MAIN

    return Math.floor(Math.floor((lvlMod_main * jobMod_att / 1000) + wd) * (delay / 3))
}
