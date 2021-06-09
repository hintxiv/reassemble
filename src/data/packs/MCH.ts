import {preserve} from 'utilities/types'
import {Action, Debuff, Status} from '../types'

export const ACTIONS = preserve<Action>()({
    GAUSS_ROUND: {
        id: 2874,
        type: 'Ability',
        potency: 150,
    },
    SPREAD_SHOT: {
        id: 2870,
        type: 'Weaponskill',
        potency: 180,
        multihit: true,
    },
    HEAT_BLAST: {
        id: 7410,
        type: 'Weaponskill',
        potency: 220,
    },
    RICOCHET: {
        id: 2890,
        type: 'Ability',
        potency: 150,
        multihit: true,
        falloff: 0.5,
    },
    AUTO_CROSSBOW: {
        id: 16497,
        type: 'Weaponskill',
        potency: 180,
        multihit: true,
    },
    HEATED_SPLIT_SHOT: {
        id: 7411,
        type: 'Weaponskill',
        potency: 220,
        startsCombo: true,
    },
    DRILL: {
        id: 16498,
        type: 'Weaponskill',
        potency: 700,
    },
    HEATED_SLUG_SHOT: {
        id: 7412,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 7411,
            duration: 15,
            potency: 330,
        },
    },
    HEATED_CLEAN_SHOT: {
        id: 7413,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 7412,
            duration: 15,
            potency: 440,
        },
    },
    BIOBLASTER: {
        id: 16499,
        type: 'Weaponskill',
        potency: 60,
        multihit: true,
    },
    AIR_ANCHOR: {
        id: 16500,
        type: 'Weaponskill',
        potency: 700,
    },
    WILDFIRE: {
        id: 2878,
        type: 'Ability',
    },

    // Queen stuff
    AUTOMATON_QUEEN: {
        id: 16501,
        type: 'Ability',
    },
    ARM_PUNCH: {
        id: 16504,
        type: 'Weaponskill',
        potency: 150,
    },
    ROLLER_DASH: {
        id: 17206,
        type: 'Weaponskill',
        potency: 300,
    },
    PILE_BUNKER: {
        id: 16503,
        type: 'Weaponskill',
        potency: 400,  // @ 50 battery
    },
})

export const STATUSES = preserve<Status>()({
    REASSEMBLED: {
        id: 851,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    BIOBLASTER: {
        id: 1866,
        potency: 60,
        castActions: [ACTIONS.BIOBLASTER.id],
    },
    WILDFIRE: {
        id: 861,
        potency: 1200,  // TODO
        castActions: [ACTIONS.WILDFIRE.id],
    },
})
