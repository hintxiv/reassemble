import {RAIDBUFFS as DATA} from 'data/packs'
import {Buff} from 'simulator/buff'

export const RAID_BUFFS: Buff[] = [
    {
        statusID: DATA.STATUSES.BATTLE_LITANY.id,
        critRate: 0.1,
    },
    {
        statusID: DATA.STATUSES.BATTLE_VOICE.id,
        directRate: 0.2,
    },
    {
        statusID: DATA.STATUSES.BROTHERHOOD.id,
        potency: 1.05,
    },
    {
        statusID: DATA.STATUSES.DIVINATION.id,
        potency: 1.06,
    },
    {
        statusID: DATA.STATUSES.DEVILMENT.id,
        critRate: 0.2,
        directRate: 0.2,
    },
    {
        statusID: DATA.STATUSES.DEVOTION.id,
        potency: 1.05,
    },
    {
        statusID: DATA.STATUSES.STANDARD_FINISH.id,
        potency: 1.05,
    },
    {
        statusID: DATA.STATUSES.TECHNICAL_FINISH.id,
        potency: 1.05,
    },
    {
        statusID: DATA.STATUSES.LEFT_EYE.id,
        potency: 1.05,
    },
    {
        statusID: DATA.STATUSES.MEDICATED.id,
        mainStat: 464,
    },
]

export const RAID_DEBUFFS: Buff[] = [
    {
        statusID: DATA.DEBUFFS.CHAIN_STRATAGEM.id,
        critRate: 0.1,
    },
    {
        statusID: DATA.DEBUFFS.TRICK_ATTACK.id,
        potency: 1.05,
    },
]
