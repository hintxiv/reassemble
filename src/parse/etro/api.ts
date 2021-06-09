import ky, {Options} from 'ky'
import {Stats} from 'simulator/entity/player/stats'

const statLookup: Record<string, keyof Stats> = {
    ['Weapon Damage']: 'weapondamage',
    ['Weapon DMG']: 'weapondamage',
    STR: 'strength',
    DEX: 'dexterity',
    VIT: 'vitality',
    INT: 'intelligence',
    MND: 'mind',
    CRT: 'critical',
    DET: 'determination',
    DH: 'direct',
    SKS: 'skillspeed',
    SPS: 'spellspeed',
    TEN: 'tenacity',
}

const options: Options = {
    prefixUrl: process.env.ETRO_API_URL,
}

const etro = ky.create(options)

interface EtroResponseGearset
{
    name: string
    totalParams: Array< {name: string, value: number} >
    // ... some other stuff too, but we only care about these fields
}

async function getGearset(id: string): Promise<EtroResponseGearset> {
    const response = await etro.get(`gearsets/${id}/`)

    return response.json()
}

export async function getStats(id: string): Promise<{name: string, stats: Stats}> {
    const gearset = await getGearset(id)

    const name = gearset.name

    const stats: Stats = {
        weapondamage: 0,
        vitality: 0,
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        mind: 0,
        critical: 0,
        determination: 0,
        direct: 0,
        skillspeed: 0,
        spellspeed: 0,
        tenacity: 0,
    }

    gearset.totalParams.forEach(p => {
        if (p.name in statLookup) {
            stats[statLookup[p.name]] = p.value
        }
    })

    return {name, stats}
}
