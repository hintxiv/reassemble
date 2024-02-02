import {preserve} from 'utilities/types'
import {Action, Debuff, Status} from '../types'

export const ACTIONS = preserve<Action>()({
    BOOTSHINE: {
        id: 53,
        type: 'Weaponskill',
        potency: 210,
    },
    TRUE_STRIKE: {
        id: 54,
        type: 'Weaponskill',
        potency: 300,
    },
    SNAP_PUNCH: {
        id: 56,
        type: 'Weaponskill',
        potency: 310,
    },
    TWIN_SNAKES: {
        id: 61,
        type: 'Weaponskill',
        potency: 280,
    },
    DEMOLISH: {
        id: 66,
        type: 'Weaponskill',
        potency: 130,
    },
    ROCKBREAKER: {
        id: 70,
        type: 'Weaponskill',
        potency: 130,
        multihit: true,
    },
    FOUR_POINT_FURY: {
        id: 16473,
        type: 'Weaponskill',
        potency: 120,
        multihit: true,
    },
    DRAGON_KICK: {
        id: 74,
        type: 'Weaponskill',
        potency: 320,
    },
    THE_FORBIDDEN_CHAKRA: {
        id: 3547,
        type: 'Ability',
        potency: 340,
    },
    ENLIGHTENMENT: {
        id: 16474,
        type: 'Ability',
        potency: 170,
        multihit: true,
    },
    ELIXIR_FIELD: {
        id: 3545,
        type: 'Weaponskill',
        potency: 600,
        multihit: true,
        falloff: 0.7,
    },
    CELESTIAL_REVOLUTION: {
        id: 25765,
        type: 'Weaponskill',
        potency: 450,
    },
    SHADOW_OF_THE_DESTROYER: {
        id: 25767,
        type: 'Weaponskill',
        potency: 110,
        multihit: true,
    },
    RISING_PHOENIX: {
        id: 25768,
        type: 'Weaponskill',
        potency: 700,
        multihit: true,
        falloff: 0.7,
    },
    SIX_SIDED_STAR: {
        id: 16476,
        type: 'Weaponskill',
        potency: 550,
    },
    PHANTOM_RUSH: {
        id: 25769,
        type: 'Weaponskill',
        potency: 1150,
        multihit: true,
        falloff: 0.5,
    },
})

export const STATUSES = preserve<Status>()({
    RIDDLE_OF_FIRE: {
        id: 1181,
    },
    MEDITATIVE_BROTHERHOOD: {
        id: 1182,
    },
    PERFECT_BALANCE: {
        id: 110,
    },
    FORMLESS_FIST: {
        id: 2513,
    },
    LEADEN_FIST: {
        id: 1861,
    },
    DISCIPLINED_FIST: {
        id: 3001,
    },
    OPO_OPO_FORM: {
        id: 107,
    },
    RAPTOR_FORM: {
        id: 108,
    },
    COEURL_FORM: {
        id: 109,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    DEMOLISH: {
        id: 246,
        potency: 70,
        castActions: [ACTIONS.DEMOLISH.id],
    },
})
