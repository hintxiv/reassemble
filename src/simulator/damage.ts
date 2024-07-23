import { ActionType } from '../data/types'
import { Buff } from './buff'

export type DamageType = ActionType | 'DoT'

export type RNGType = 'normal' | 'auto' | 'none'

export interface DamageOptions
{
    pet?: string
    addedPotency?: number
    critType?: RNGType
    dhType?: RNGType
    ignoreComboRequirements?: boolean
    /*
    * If specified, this function will be called after
    * the simulator has processed all events to determine
    * this instance's potency
    */
    postAdjustment?: () => number
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
