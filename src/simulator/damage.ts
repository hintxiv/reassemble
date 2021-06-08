import { ActionType } from '../data/types'
import { Buff } from './buff'

export type DamageType = ActionType | "DoT"

export interface DamageOptions
{
    pet?: string
    addedPotency?: number
    noCrit?: boolean
    noDirect?: boolean
}

export interface CastInstance
{
    timestamp: number
    targetKey: string
    potency: number
    buffs: Buff[]
    firstHit?: boolean
    options: DamageOptions
}

export interface DamageInstance
{
    type: DamageType
    timestamp: number
    potency: number
    buffs: Buff[]
    falloff?: number
    options: DamageOptions
}

export type SolvedDamageInstance = 
    DamageInstance & {damage: number}
