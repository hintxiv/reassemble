import {preserve} from 'utilities/types'
import {Action, Debuff, Status} from '../types'

// TODO -- Flamethrower
export const ACTIONS = preserve<Action>()({
    GAUSS_ROUND: {
        id: 2874,
        type: 'Ability',
        potency: 130,
    },
    SPREAD_SHOT: {
        id: 2870,
        type: 'Weaponskill',
        potency: 140,
        multihit: true,
    },
    HEAT_BLAST: {
        id: 7410,
        type: 'Weaponskill',
        potency: 180,
    },
    RICOCHET: {
        id: 2890,
        type: 'Ability',
        potency: 130,
        multihit: true,
        falloff: 0.5,
    },
    AUTO_CROSSBOW: {
        id: 16497,
        type: 'Weaponskill',
        potency: 140,
        multihit: true,
    },
    HEATED_SPLIT_SHOT: {
        id: 7411,
        type: 'Weaponskill',
        potency: 200,
        startsCombo: true,
    },
    DRILL: {
        id: 16498,
        type: 'Weaponskill',
        potency: 580,
    },
    HEATED_SLUG_SHOT: {
        id: 7412,
        type: 'Weaponskill',
        potency: 120,
        combo: {
            from: 7411,
            duration: 30,
            potency: 300,
        },
    },
    HEATED_CLEAN_SHOT: {
        id: 7413,
        type: 'Weaponskill',
        potency: 120,
        combo: {
            from: 7412,
            duration: 30,
            potency: 380,
        },
    },
    BIOBLASTER: {
        id: 16499,
        type: 'Weaponskill',
        potency: 50,
        multihit: true,
    },
    AIR_ANCHOR: {
        id: 16500,
        type: 'Weaponskill',
        potency: 580,
    },
    WILDFIRE: {
        id: 2878,
        type: 'Ability',
    },
    SCATTERGUN: {
        id: 25876,
        type: 'Weaponskill',
        potency: 150,
        multihit: true,
    },
    CHAIN_SAW: {
        id: 25788,
        type: 'Weaponskill',
        potency: 580,
        multihit: true,
        falloff: 0.65,
    },

    // Queen stuff
    AUTOMATON_QUEEN: {
        id: 16501,
        type: 'Ability',
    },
    ARM_PUNCH: {
        id: 16504,
        type: 'Weaponskill',
        potency: 120, // @ 50 battery
    },
    ROLLER_DASH: {
        id: 17206,
        type: 'Weaponskill',
        potency: 240, // @ 50 battery
    },
    PILE_BUNKER: {
        id: 16503,
        type: 'Ability',
        potency: 340,  // @ 50 battery
    },
    CROWNED_COLLIDER: {
        id: 25787,
        type: 'Ability',
        potency: 390, // @ 50 battery
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
        potency: 50,
        castActions: [ACTIONS.BIOBLASTER.id],
    },
    WILDFIRE: {
        id: 861,
        potency: 1320,  // TODO
        castActions: [ACTIONS.WILDFIRE.id],
    },
})
