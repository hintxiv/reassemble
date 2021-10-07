import { Level } from 'math/modifiers/level'
import { GearGroup } from 'simulator/gear/gear'
import { StatGroup } from 'simulator/gear/stats'

type StatCaps = Record<StatGroup, number>

export interface Encounter
{
    zoneID: number
    ilvlSync: number
    levelSync: Level
    rangedStatCaps: Record<GearGroup, StatCaps>

    // TODO
    casterStatCaps?: Record<GearGroup, StatCaps>
    meleeStatCaps?: Record<GearGroup, StatCaps>
    tankStatCaps?: Record<GearGroup, StatCaps>

    // TODO odd ducks
    dragoonStatCaps?: Record<GearGroup, StatCaps>
    paladinStatCaps?: Record<GearGroup, StatCaps>
}
