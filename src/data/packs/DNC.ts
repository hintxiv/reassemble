import {preserve} from 'utilities/types'
import {Action, Status} from '../types'

export const ACTIONS = preserve<Action>()({
    CASCADE: {
        id: 15989,
        type: 'Weaponskill',
        potency: 250,
        startsCombo: true,
        breaksCombo: true,
    },
    FOUNTAIN: {
        id: 15990,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 15989,
            duration: 20,
            potency: 300,
        },
        breaksCombo: true,
    },
    WINDMILL: {
        id: 15993,
        type: 'Weaponskill',
        potency: 150,
        startsCombo: true,
        breaksCombo: true,
        multihit: true,
        falloff: 0.5,
    },
    BLADESHOWER: {
        id: 15994,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 15993,
            duration: 20,
            potency: 200,
        },
        breaksCombo: true,
        multihit: true,
    },
    STANDARD_FINISH: {
        id: 16003,
        type: 'Ability',
        potency: 500,
        multihit: true,
        falloff: 0.75,
    },
    SINGLE_STANDARD_FINISH: {
        id: 16191,
        type: 'Ability',
        potency: 750,
        multihit: true,
        falloff: 0.75,
    },
    DOUBLE_STANDARD_FINISH: {
        id: 16192,
        type: 'Ability',
        potency: 1000,
        multihit: true,
        falloff: 0.75,
    },
    REVERSE_CASCADE: {
        id: 15991,
        type: 'Weaponskill',
        potency: 300,
    },
    FAN_DANCE: {
        id: 16007,
        type: 'Ability',
        potency: 150,
    },
    RISING_WINDMILL: {
        id: 15995,
        type: 'Weaponskill',
        potency: 300,
        multihit: true,
        falloff: 0.5,
    },
    FOUNTAINFALL: {
        id: 15992,
        type: 'Weaponskill',
        potency: 350,
    },
    BLOODSHOWER: {
        id: 15996,
        type: 'Weaponskill',
        potency: 350,
        multihit: true,
        falloff: 0.5,
    },
    FAN_DANCE_II: {
        id: 16008,
        type: 'Ability',
        potency: 100,
        multihit: true,
    },
    FAN_DANCE_III: {
        id: 16009,
        type: 'Ability',
        potency: 200,
        multihit: true,
        falloff: 0.5,
    },
    TECHNICAL_FINISH: {
        id: 16004,
        type: 'Ability',
        potency: 500,
        multihit: true,
        falloff: 0.75,
    },
    SINGLE_TECHNICAL_FINISH: {
        id: 16193,
        type: 'Ability',
        potency: 750,
        multihit: true,
        falloff: 0.75,
    },
    DOUBLE_TECHNICAL_FINISH: {
        id: 16194,
        type: 'Ability',
        potency: 1000,
        multihit: true,
        falloff: 0.75,
    },
    TRIPLE_TECHNICAL_FINISH: {
        id: 16195,
        type: 'Ability',
        potency: 1250,
        multihit: true,
        falloff: 0.75,
    },
    QUADRUPLE_TECHNICAL_FINISH: {
        id: 16196,
        type: 'Ability',
        potency: 1500,
        multihit: true,
        falloff: 0.75,
    },
    SABER_DANCE: {
        id: 16005,
        type: 'Weaponskill',
        potency: 600,
        multihit: true,
        falloff: 0.5,
    },
})

export const STATUSES = preserve<Status>()({
    STANDARD_FINISH: {
        id: 1821,
    },
    DEVILMENT: {
        id: 1825,
    },
})
