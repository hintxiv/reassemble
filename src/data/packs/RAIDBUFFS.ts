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
    EMBOLDEN: {
        id: 1297,
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
    ARCANE_CIRCLE: {
        id: 2599,
    },
    RADIANT_FINALE: {
        id: 2964,
    },
    SEARING_LIGHT: {
        id: 2703,
    },
    THE_BALANCE: {
        id: 1882,
    },
    THE_BOLE: {
        id: 1883,
    },
    THE_ARROW: {
        id: 1884,
    },
    THE_SPEAR: {
        id: 1885,
    },
    THE_EWER: {
        id: 1886,
    },
    THE_SPIRE: {
        id: 1887,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    CHAIN_STRATAGEM: {
        id: 1221,
        castActions: [7436],
    },
    MUG: {
        id: 638,
        castActions: [2248],
    },
})
