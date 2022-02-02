import { RAIDBUFFS } from 'data/packs'
import { Buff } from 'simulator/buff'

export const RAID_BUFFS: Buff[] = [
    {
        statusID: RAIDBUFFS.STATUSES.BATTLE_LITANY.id,
        critRate: 0.1,
    },
    {
        statusID: RAIDBUFFS.STATUSES.BATTLE_VOICE.id,
        directRate: 0.2,
    },
    {
        statusID: RAIDBUFFS.STATUSES.BROTHERHOOD.id,
        potency: 1.05,
    },
    {
        statusID: RAIDBUFFS.STATUSES.DIVINATION.id,
        potency: 1.06,
    },
    {
        statusID: RAIDBUFFS.STATUSES.DEVILMENT.id,
        critRate: 0.2,
        directRate: 0.2,
    },
    {
        statusID: RAIDBUFFS.STATUSES.EMBOLDEN.id,
        potency: 1.05,
    },
    {
        statusID: RAIDBUFFS.STATUSES.STANDARD_FINISH.id,
        potency: 1.05,
    },
    {
        statusID: RAIDBUFFS.STATUSES.TECHNICAL_FINISH.id,
        potency: 1.05,
    },
    {
        statusID: RAIDBUFFS.STATUSES.LEFT_EYE.id,
        potency: 1.05,
    },
    {
        statusID: RAIDBUFFS.STATUSES.MEDICATED.id,
        mainStat: 464,
    },
    {
        statusID: RAIDBUFFS.STATUSES.ARCANE_CIRCLE.id,
        potency: 1.03,
    },
    {
        statusID: RAIDBUFFS.STATUSES.SEARING_LIGHT.id,
        potency: 1.03,
    },
    {
        statusID: RAIDBUFFS.STATUSES.RADIANT_FINALE.id,
        potency: 1.06,
    },
]

export const RAID_DEBUFFS: Buff[] = [
    {
        statusID: RAIDBUFFS.DEBUFFS.CHAIN_STRATAGEM.id,
        critRate: 0.1,
    },
    {
        statusID: RAIDBUFFS.DEBUFFS.TRICK_ATTACK.id,
        potency: 1.05,
    },
]
