import { preserve}  from 'utilities/types'
import { Action, Debuff, Status } from '../types'

export const ACTIONS = preserve<Action>()({
    SLICE: {
        id: 24373,
        type: 'Weaponskill',
        potency: 300,
        startsCombo: true,
        breaksCombo: true,
    },
    WAXING_SLICE: {
        id: 24374,
        type: 'Weaponskill',
        potency: 140,
        combo: {
            from: 24373,
            duration: 30,
            potency: 380,
        },
        breaksCombo: true,
    },
    INFERNAL_SLICE: {
        id: 24375,
        type: 'Weaponskill',
        potency: 140,
        combo: {
            from: 24374,
            duration: 30,
            potency: 460,
        },
        breaksCombo: true,
    },
    SHADOW_OF_DEATH: {
        id: 24378,
        type: 'Weaponskill',
        potency: 300,
    },
    WHORL_OF_DEATH: {
        id: 24379,
        type: 'Weaponskill',
        potency: 100,
        multihit: true,
    },
    GIBBET: {
        id: 24382,
        type: 'Weaponskill',
        potency: 460,
    },
    GALLOWS: {
        id: 24383,
        type: 'Weaponskill',
        potency: 460,
    },
    GUILLOTINE: {
        id: 24384,
        type: 'Weaponskill',
        potency: 200,
        multihit: true,
    },
    HARPE: {
        id: 24386,
        type: 'Weaponskill',
        potency: 300,
    },
    SPINNING_SCYTHE: {
        id: 24376,
        type: 'Weaponskill',
        potency: 140,
        multihit: true,
        startsCombo: true,
        breaksCombo: true,
    },
    NIGHTMARE_SCYTHE: {
        id: 24377,
        type: 'Weaponskill',
        potency: 120,
        multihit: true,
        combo: {
            from: 24376,
            duration: 30,
            potency: 180,
        },
        breaksCombo: true,
    },
    HARVEST_MOON: {
        id: 24388,
        type: 'Weaponskill',
        potency: 600,
        multihit: true,
        falloff: 0.5,
    },
    PLENTIFUL_HARVEST: {
        id: 24385,
        type: 'Weaponskill',
        potency: 800,
        multihit: true,
        falloff: 0.6,
    },
    VOID_REAPING: {
        id: 24395,
        type: 'Weaponskill',
        potency: 460,
    },
    CROSS_REAPING: {
        id: 24396,
        type: 'Weaponskill',
        potency: 460,
    },
    GRIM_REAPING: {
        id: 24397,
        type: 'Weaponskill',
        potency: 200,
        multihit: true,
    },
    COMMUNIO: {
        id: 24398,
        type: 'Spell',
        potency: 1000,
        multihit: true,
        falloff: 0.6,
    },
    SOUL_SLICE: {
        id: 24380,
        type: 'Weaponskill',
        potency: 460,
    },
    SOUL_SCYTHE: {
        id: 24381,
        type: 'Weaponskill',
        potency: 180,
        multihit: true,
    },
    GLUTTONY: {
        id: 24393,
        type: 'Ability',
        potency: 500,
        multihit: true,
        falloff: 0.25,
    },
    LEMURES_SLICE: {
        id: 24399,
        type: 'Ability',
        potency: 200,
    },
    LEMURES_SCYTHE: {
        id: 24400,
        type: 'Ability',
        potency: 100,
        multihit: true,
    },
    BLOOD_STALK: {
        id: 24389,
        type: 'Ability',
        potency: 340,
    },
    GRIM_SWATHE: {
        id: 24392,
        type: 'Ability',
        potency: 140,
        multihit: true,
    },
    UNVEILED_GIBBET: {
        id: 24390,
        type: 'Ability',
        potency: 400,
    },
    UNVEILED_GALLOWS: {
        id: 24391,
        type: 'Ability',
        potency: 400,
    },
})

export const STATUSES = preserve<Status>()({
    ENHANCED_GIBBET: {
        id: 2588,
    },
    ENHANCED_GALLOWS: {
        id: 2589,
    },
    ENHANCED_VOID_REAPING: {
        id: 2590,
    },
    ENHANCED_CROSS_REAPING: {
        id: 2591,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    DEATHS_DESIGN: {
        id: 2586,
        castActions: [
            ACTIONS.SHADOW_OF_DEATH.id,
            ACTIONS.WHORL_OF_DEATH.id,
        ],
    },
})
