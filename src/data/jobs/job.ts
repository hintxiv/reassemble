import { DamageType } from '../../simulator/damage'
import { Patch } from '../patch'
import { Player } from 'simulator/entity'
import { CastHandler, DamageHandler } from 'simulator/handlers'

export const enum Attribute 
{
    HP, MP, STR, VIT, DEX, INT, MND
}

type DamageMap = {
    [key in DamageType]?: Attribute
}

export type Job =
    | "Bard"
    | "Dancer"
    | "Machinist"

export interface JobInfo
{
    name: Job
    playerCtor: {
        // hmm... this part should probably be handled by the simulator instead
        // any way to infer the constructor signature?
        new (id: number, castCallback: CastHandler, damageCallback: DamageHandler): Player
    }
    mainStat: Attribute
    weaponDelay: number
    trait: number
    iconPath: string
    latest: Patch
    damageMap: DamageMap
}
