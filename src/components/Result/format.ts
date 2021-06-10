import { DatumValue } from '@nivo/core'
import { Stats } from 'simulator/entity/player/stats'

// Convert seconds to mm:ss
export function formatSeconds(seconds: number | DatumValue) {
    const s = <number> seconds // this should never be a string / date
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toFixed().padStart(2, '0')}`
}

export function formatDamage(damage: number | DatumValue) {
    const d = <number> damage // this should never be a string / date
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
