import { DatumValue } from '@nivo/core'
import { Stats } from 'simulator/entity/player/stats'

// Convert seconds to mm:ss
export function formatSeconds(seconds: number | DatumValue) {
    // this will never be a string / date
    const s = <number> seconds
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toFixed().padStart(2, '0')}`
}

export function formatDamage(damage: number | DatumValue) {
    // this will never be a string / date
    const d = <number> damage
    // separate thousands with commas
    return d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const PROPER_STAT_NAME: Record<keyof Stats, string> = {
    weapondamage: 'Weapon Damage',
    vitality: 'Vitality',
    strength: 'Strength',
    dexterity: 'Dexterity',
    intelligence: 'Intelligence',
    mind: 'Mind',
    critical: 'Critical Hit',
    determination: 'Determination',
    direct: 'Direct Hit',
    skillspeed: 'Skill Speed',
    spellspeed: 'Spell Speed',
    tenacity: 'Tenacity',
}

export const SHORT_STAT_NAME: Record<keyof Stats, string> = {
    weapondamage: 'WD',
    vitality: 'VIT',
    strength: 'STR',
    dexterity: 'DEX',
    intelligence: 'INT',
    mind: 'MND',
    critical: 'CRIT',
    determination: 'DET',
    direct: 'DH',
    skillspeed: 'SKS',
    spellspeed: 'SPS',
    tenacity: 'TEN',
}
