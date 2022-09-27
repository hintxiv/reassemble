import { preserve } from 'utilities/types'
import { Action, Debuff, Status } from '../types'

// TODO -- Doton
export const ACTIONS = preserve<Action>()({
    SPINNING_EDGE: {
        id: 2240,
        type: 'Weaponskill',
        potency: 220,
        startsCombo: true,
        breaksCombo: true,
    },
    GUST_SLASH: {
        id: 2242,
        type: 'Weaponskill',
        potency: 160,
        combo: {
            from: 2240,
            duration: 30,
            potency: 320,
        },
        breaksCombo: true,
    },
    THROWING_DAGGER: {
        id: 2247,
        type: 'Weaponskill',
        potency: 120,
        breaksCombo: true,
    },
    MUG: {
        id: 2248,
        type: 'Ability',
        potency: 150,
    },
    TRICK_ATTACK: {
        id: 2258,
        type: 'Ability',
        potency: 400,
    },
    AEOLIAN_EDGE: {
        id: 2255,
        type: 'Weaponskill',
        potency: 140,
        combo: {
            from: 2242,
            duration: 30,
            potency: 440,
        },
        breaksCombo: true,
    },
    DEATH_BLOSSOM: {
        id: 2254,
        type: 'Weaponskill',
        potency: 100,
        multihit: true,
        startsCombo: true,
        breaksCombo: true,
    },
    ASSASSINATE: {
        id: 2246,
        type: 'Ability',
        potency: 200,
    },
    HAKKE_MUJINSATSU: {
        id: 16488,
        type: 'Weaponskill',
        potency: 100,
        multihit: true,
        combo: {
            from: 2254,
            duration: 30,
            potency: 130,
        },
        breaksCombo: true,
    },
    ARMOR_CRUSH: {
        id: 3563,
        type: 'Weaponskill',
        potency: 200,
        combo: {
            from: 2242,
            duration: 30,
            potency: 420,
        },
        breaksCombo: true,
    },
    DREAM_WITHIN_A_DREAM: {
        id: 3566,
        type: 'Ability',
        potency: 150,
        multihit: true, // Not really but FFLogs treats this as an untargeted action...
    },
    HURAIJIN: {
        id: 25876,
        type: 'Weaponskill',
        potency: 200,
        breaksCombo: true,
    },
    HELLFROG_MEDIUM: {
        id: 7401,
        type: 'Ability',
        potency: 160,
        multihit: true,
    },
    BHAVACAKRA: {
        id: 7402,
        type: 'Ability',
        potency: 350,
    },
    HOLLOW_NOZUCHI: {
        id: 25776,
        type: 'Ability',
        potency: 50,
        multihit: true,
    },
    FORKED_RAIJU: {
        id: 25778,
        type: 'Weaponskill',
        potency: 560,
    },
    FLEETING_RAIJU: {
        id: 25777,
        type: 'Weaponskill',
        potency: 560,
    },

    // Ninjutsu
    FUMA_SHURIKEN: {
        id: 2265,
        type: 'Ability',
        potency: 450,
    },
    // What the fuck is this, square?
    FUMA_SHURIKEN_TCJ_TEN: {
        id: 18873,
        type: 'Ability',
        potency: 450,
    },
    FUMA_SHURIKEN_TCJ_CHI: {
        id: 18874,
        type: 'Ability',
        potency: 450,
    },
    FUMA_SHURIKEN_TCJ_JIN: {
        id: 18875,
        type: 'Ability',
        potency: 450,
    },
    KATON: {
        id: 2266,
        type: 'Ability',
        potency: 350,
        multihit: true,
    },
    KATON_TCJ: {
        id: 18876,
        type: 'Ability',
        potency: 350,
        multihit: true,
    },
    RAITON: {
        id: 2267,
        type: 'Ability',
        potency: 650,
    },
    RAITON_TCJ: {
        id: 18877,
        type: 'Ability',
        potency: 650,
    },
    HYOTON: {
        id: 2268,
        type: 'Ability',
        potency: 350,
    },
    HYOTON_TCJ: {
        id: 18878,
        type: 'Ability',
        potency: 350,
    },
    SUITON: {
        id: 2271,
        type: 'Ability',
        potency: 500,
    },
    SUITON_TCJ: {
        id: 18881,
        type: 'Ability',
        potency: 500,
    },
    GOKA_MEKKYAKU: {
        id: 16491,
        type: 'Ability',
        potency: 600,
        multihit: true,
    },
    HYOSHO_RANRYU: {
        id: 16492,
        type: 'Ability',
        potency: 1300,
    },

    // Pet actions
    PHANTOM_KAMAITACHI: {
        id: 25775,
        type: 'Weaponskill',
        potency: 600,
        multihit: true,
        falloff: 0.5,
    },
    SPINNING_EDGE_BUNSHIN: {
        id: 17413,
        type: 'Weaponskill',
        potency: 160,
    },
    GUST_SLASH_BUNSHIN: {
        id: 17414,
        type: 'Weaponskill',
        potency: 160,
    },
    THROWING_DAGGER_BUNSHIN: {
        id: 17418,
        type: 'Weaponskill',
        potency: 160,
    },
    AEOLIAN_EDGE_BUNSHIN: {
        id: 17415,
        type: 'Weaponskill',
        potency: 160,
    },
    DEATH_BLOSSOM_BUNSHIN: {
        id: 17419,
        type: 'Weaponskill',
        potency: 80,
        multihit: true,
    },
    HAKKE_MUJINSATSU_BUNSHIN: {
        id: 17420,
        type: 'Weaponskill',
        potency: 80,
        multihit: true,
    },
    HURAIJIN_BUNSHIN: {
        id: 25877,
        type: 'Weaponskill',
        potency: 160,
    },
    FORKED_RAIJU_BUNSHIN: {
        id: 25878,
        type: 'Weaponskill',
        potency: 160,
    },
    FLEETING_RAIJU_BUNSHIN: {
        id: 25879,
        type: 'Weaponskill',
        potency: 160,
    },
})

export const STATUSES = preserve<Status>()({
    KASSATSU: {
        id: 497,
    },
    MEISUI: {
        id: 2689,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    TRICK_ATTACK: {
        id: 3254,
        castActions: [ACTIONS.TRICK_ATTACK.id],
    },
})
