import ky, { Options } from 'ky'
import { Stats } from 'simulator/gear/stats'

export const statIDs: Record<number, keyof Stats> = {
    [12]: 'weaponDamage',
    [-1]: 'strength', // TODO
    [2]: 'dexterity',
    [3]: 'vitality',
    [-2]: 'intelligence', // TODO
    [-3]: 'mind', // TODO
    [22]: 'direct',
    [27]: 'critical',
    [44]: 'determination',
    [45]: 'skillspeed',
    [-4]: 'spellspeed', // TODO
    [-5]: 'tenacity', // TODO
}

const options: Options = {
    prefixUrl: process.env.ETRO_API_URL,
}

const etro = ky.create(options)

export const equipmentKeys = [
    'weapon', 'head', 'body', 'hands', 'waist', 'legs', 'feet',
    'offHand', 'ears', 'neck', 'wrists', 'fingerL', 'fingerR',
] as const

export type Slot = typeof equipmentKeys[number]

export interface EtroResponseGearset {
    name: string
    jobAbbrev: string
    totalParams: Array<{ id: number, name: string, value: number }>
    weapon?: string
    relics?: {
        weapon: string,
    }
    head: string
    body: string
    hands: string
    waist: string
    legs: string
    feet: string
    offHand?: string
    ears: string
    neck: string
    wrists: string
    fingerL: string
    fingerR: string
    food: string

    materia: Record<string, Record<string, number>>

    // Some other stuff that we don't care about
}

export interface EtroResponseEquipment {
    name: string
    itemLevel: number
    param0?: number
    param1?: number
    param2?: number
    param3?: number
    param4?: number
    param5?: number
    param0Value: number
    param1Value: number
    param2Value: number
    param3Value: number
    param4Value: number
    param5Value: number
    damageMag: number
    damagePhys: number
}

export interface EtroResponseRelic {
    name: string
    baseItem: {
        itemLevel: number
        param0?: number
        param1?: number
        param2?: number
        param3?: number
        param4?: number
        param5?: number
        param0Value: number
        param1Value: number
        param2Value: number
        param3Value: number
        param4Value: number
        param5Value: number
        damageMag: number
        damagePhys: number
    }
    param0?: number
    param1?: number
    param2?: number
    param3?: number
    param4?: number
    param5?: number
    param0Value: number
    param1Value: number
    param2Value: number
    param3Value: number
    param4Value: number
    param5Value: number
}

export async function fetchGearset(id: string): Promise<EtroResponseGearset> {
    const response = await etro.get(`gearsets/${id}/`)

    return response.json()
}

export async function fetchEquipment(id: string): Promise<EtroResponseEquipment> {
    const response = await etro.get(`equipment/${id}/`)

    return response.json()
}

export async function fetchRelic(id: string): Promise<EtroResponseRelic> {
    const response = await etro.get(`relic/${id}/`)

    return response.json()
}
