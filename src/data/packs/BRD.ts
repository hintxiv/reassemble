import {preserve} from 'utilities/types'
import {Action, Debuff, Status} from '../types'

export const ACTIONS = preserve<Action>()({
    BLOODLETTER: {
        id: 110,
        type: 'Ability',
        potency: 150,
    },
    QUICK_NOCK: {
        id: 106,
        type: 'Weaponskill',
        potency: 510,
        multihit: true,
    },
    MAGES_BALLAD: {
        id: 114,
        type: 'Spell',
        potency: 100,
    },
    ARMYS_PAEON: {
        id: 116,
        type: 'Spell',
        potency: 100,
    },
    RAIN_OF_DEATH: {
        id: 117,
        type: 'Ability',
        potency: 130,
        multihit: true,
    },
    THE_WANDERERS_MINUET: {
        id: 3559,
        type: 'Spell',
        potency: 100,
    },
    PITCH_PERFECT: {
        id: 7404,
        type: 'Ability',
    },
    EMPYREAL_ARROW: {
        id: 3558,
        type: 'Ability',
        potency: 230,
    },
    IRON_JAWS: {
        id: 3560,
        type: 'Weaponskill',
        potency: 100,
    },
    SIDEWINDER: {
        id: 3562,
        type: 'Ability',
        potency: 350,
    },
    CAUSTIC_BITE: {
        id: 7406,
        type: 'Weaponskill',
        potency: 150,
    },
    STORMBITE: {
        id: 7407,
        type: 'Weaponskill',
        potency: 100,
    },
    SHADOWBITE: {
        id: 16494,
        type: 'Ability',
        potency: 220,
        multihit: true,
    },
    BURST_SHOT: {
        id: 16495,
        type: 'Weaponskill',
        potency: 250,
    },
    APEX_ARROW: {
        id: 16496,
        type: 'Weaponskill',
        multihit: true,
    },
    REFULGENT_ARROW: {
        id: 7409,
        type: 'Weaponskill',
        potency: 340,
    },
})

export const STATUSES = preserve<Status>()({
    RAGING_STRIKES: {
        id: 125,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    CAUSTIC_BITE: {
        id: 1200,
        potency: 40,
        castActions: [
            ACTIONS.CAUSTIC_BITE.id,
            ACTIONS.IRON_JAWS.id,
        ],
    },
    STORMBITE: {
        id: 1201,
        potency: 50,
        castActions: [
            ACTIONS.STORMBITE.id,
            ACTIONS.IRON_JAWS.id,
        ],
    },
})
