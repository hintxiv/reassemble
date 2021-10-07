import { Stats } from './stats'

export type Slot =
    | 'weapon'
    | 'head'
    | 'body'
    | 'hands'
    | 'waist'
    | 'legs'
    | 'feet'
    | 'offHand'
    | 'ears'
    | 'neck'
    | 'wrists'
    | 'finger'

export type GearGroup =
    | 'weapon'
    | 'offHand'
    | 'body'
    | 'head'
    | 'accessory'

export const gearMap: Record<Slot, GearGroup> = {
    weapon: 'weapon',
    head: 'head',
    body: 'body',
    hands: 'head',
    waist: 'accessory',
    legs: 'body',
    feet: 'head',
    offHand: 'offHand',
    ears: 'accessory',
    neck: 'accessory',
    wrists: 'accessory',
    finger: 'accessory',
}

export interface Gear
{
    name: string
    slot: Slot
    gearGroup: GearGroup
    itemLevel: number
    stats: Partial<Stats>
    materiaStats: Partial<Stats>
}
