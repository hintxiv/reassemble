export interface Stats
{
    weapondamage: number

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

export function makeStats(someStats?: Partial<Stats>): Stats {
    const stats: Stats = {
        weapondamage: 1,
        vitality: 340,
        strength: 340,
        dexterity: 340,
        intelligence: 340,
        mind: 340,
        critical: 380,
        determination: 380,
        direct: 380,
        skillspeed: 380,
        spellspeed: 380,
        tenacity: 380,
    }

    return {...stats, ...someStats}
}
