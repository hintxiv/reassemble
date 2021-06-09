import { range } from 'utilities/other'
import * as Funcs from './functions'
import { Level } from './modifiers/level'

export const TIERED_STATS = [
    'strength',
    'dexterity',
    'intelligence',
    'mind',
    'critical',
    'determination',
    'direct',
    'skillspeed',
    'spellspeed',
    'tenacity',
]

export type TieredStat =
    | 'strength'
    | 'dexterity'
    | 'intelligence'
    | 'mind'
    | 'critical'
    | 'determination'
    | 'direct'
    | 'skillspeed'
    | 'spellspeed'
    | 'tenacity'

const TIERING_MAP: Record<TieredStat, (stat: number, level?: Level) => number> = {
    strength: Funcs.fAP,
    dexterity: Funcs.fAP,
    intelligence: Funcs.fAP,
    mind: Funcs.fAP,
    critical: Funcs.fCRIT,
    determination: Funcs.fDET,
    direct: Funcs.dhRate,
    skillspeed: Funcs.fSPD,
    spellspeed: Funcs.fSPD,
    tenacity: () => 0, // TODO
}

export function getTiers(stat: TieredStat, a: number, b: number, level: Level = 80) {
    if (a === b) { return 0 }

    const tierFn = TIERING_MAP[stat]
    const smaller = Math.min(a, b)
    const larger = Math.max(a, b)

    let prev = tierFn(smaller, level)
    let tiers = 0

    for (const i of range(smaller, larger + 1)) {
        const next = tierFn(i, level)
        if (next > prev) {
            tiers += 1
            prev = next
        }
    }

    // Return negative if b was smaller than a
    return (smaller === a) ? tiers : -tiers
}
