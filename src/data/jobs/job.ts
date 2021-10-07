import { Attribute } from 'math/modifiers/job'
import { Player } from 'simulator/entity'
import { Stats } from 'simulator/gear/stats'
import { CastHandler, DamageHandler } from 'simulator/handlers'
import { DamageType } from '../../simulator/damage'
import { Patch } from '../patch'

type DamageMap = {
    [key in DamageType]?: Attribute
}

export type Job =
    | 'Bard'
    | 'Dancer'
    | 'Machinist'

export interface JobInfo
{
    name: Job
    playerCtor: {
        // hmm... this part should probably be handled by the simulator instead
        new (id: number, castCallback: CastHandler, damageCallback: DamageHandler): Player
    }
    mainStat: Attribute
    stats: Array<keyof Stats>
    weaponDelay: number
    trait: number
    iconPath: string
    latest: Patch
    bis: string,
    damageMap: DamageMap
}
