import { preserve } from 'utilities/types'
import { Debuff, Status } from '../types'

export const STATUSES = preserve<Status>()({
    BATTLE_LITANY: {
        id: 786,
    },
    BATTLE_VOICE: {
        id: 141,
    },
    BROTHERHOOD: {
        id: 1185,
    },
    DIVINATION: {
        id: 1878,
    },
    DEVILMENT: {
        id: 1825,
    },
    DEVOTION: {
        id: 1213,
    },
    EMBOLDEN: {
        id: 1297,
        stacks: true,
    },
    LEFT_EYE: {
        id: 1454,
    },
    MEDICATED: {
        id: 49,
    },
    STANDARD_FINISH: {
        id: 2105,
    },
    TECHNICAL_FINISH: {
        id: 1822,
    },

    // AST cards
    // ...
})

export const DEBUFFS = preserve<Debuff>()({
    CHAIN_STRATAGEM: {
        id: 1221,
        castActions: [7436],
    },
    TRICK_ATTACK: {
        id: 638,
        castActions: [2258],
    },
})
