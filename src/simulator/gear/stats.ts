export interface Stats
{
    weaponDamage: number

    vitality: number

    strength: number
    dexterity: number
    intelligence: number
    mind: number

    critical: number
    determination: number
    direct: number
    skillspeed: number
    spellspeed: number
    tenacity: number
}

export type StatGroup =
    | 'weaponDamage'
    | 'vitality'
    | 'mainStat'
    | 'subStat'

export const statMap: Record<keyof Stats, StatGroup> = {
    weaponDamage: 'weaponDamage',
    vitality: 'vitality',
    strength: 'mainStat',
    dexterity: 'mainStat',
    intelligence: 'mainStat',
    mind: 'mainStat',
    critical: 'subStat',
    determination: 'subStat',
    direct: 'subStat',
    skillspeed: 'subStat',
    spellspeed: 'subStat',
    tenacity: 'subStat',
}

/**
 * Helper function to initialize a stats object with default values
 * @param someStats optionally specify some stats fields
 */
export function makeStats(someStats?: Partial<Stats> | Array<Partial<Stats>>): Stats {
    const stats: Stats = {
        weaponDamage: 0,
        vitality: 440,
        strength: 506,
        dexterity: 506,
        intelligence: 506,
        mind: 506,
        critical: 420,
        determination: 440,
        direct: 420,
        skillspeed: 420,
        spellspeed: 420,
        tenacity: 420,
    }

    if (Array.isArray(someStats)) {
        return someStats.reduce<Stats>(
            (total, s) => total = { ...total, ...s }, stats
        )
    }

    return { ...stats, ...someStats }
}
