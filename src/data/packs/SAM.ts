import { preserve}  from 'utilities/types'
import { Action, Debuff, Status } from '../types'

export const ACTIONS = preserve<Action>()({
    GYOFU: {
        id: 36963,
        type: 'Weaponskill',
        potency: 240,
        startsCombo: true,
        breaksCombo: true,
    },
    JINPU: {
        id: 7478,
        type: 'Weaponskill',
        potency: 160,
        combo: {
            from: 36963,
            duration: 30,
            potency: 320,
        },
        breaksCombo: true,
    },
    ENPI: {
        id: 7486,
        type: 'Weaponskill',
        potency: 100,
        breaksCombo: true,
    },
    SHIFU: {
        id: 7479,
        type: 'Weaponskill',
        potency: 160,
        combo: {
            from: 36963,
            duration: 30,
            potency: 320,
        },
        breaksCombo: true,
    },
    FUKO: {
        id: 25780,
        type: 'Weaponskill',
        potency: 100,
        startsCombo: true,
        breaksCombo: true,
        multihit: true,
    },
    GEKKO: {
        id: 7481,
        type: 'Weaponskill',
        potency: 180,
        combo: {
            from: 7478,
            duration: 30,
            potency: 440,
        },
        breaksCombo: true,
    },
    MANGETSU: {
        id: 7484,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 25780,
            duration: 30,
            potency: 120,
        },
        breaksCombo: true,
        multihit: true,
    },
    KASHA: {
        id: 7482,
        type: 'Weaponskill',
        potency: 180,
        combo: {
            from: 7479,
            duration: 30,
            potency: 440,
        },
        breaksCombo: true,
    },
    OKA: {
        id: 7485,
        type: 'Weaponskill',
        potency: 100,
        combo: {
            from: 25780,
            duration: 30,
            potency: 120,
        },
        breaksCombo: true,
        multihit: true,
    },
    YUKIKAZE: {
        id: 7480,
        type: 'Weaponskill',
        potency: 180,
        combo: {
            from: 36963,
            duration: 30,
            potency: 360,
        },
        breaksCombo: true,
    },
    HISSATSU_SHINTEN: {
        id: 7490,
        type: 'Ability',
        potency: 250,
    },
    HISSATSU_GYOTEN: {
        id: 7492,
        type: 'Ability',
        potency: 100,
    },
    HISSATSU_YATEN: {
        id: 7493,
        type: 'Ability',
        potency: 100,
    },
    HISSATSU_KYUTEN: {
        id: 7491,
        type: 'Ability',
        potency: 120,
        multihit: true,
    },
    HISSATSU_GUREN: {
        id: 7496,
        type: 'Ability',
        potency: 500,
        multihit: true,
        falloff: 0.25,
    },
    HISSATSU_SENEI: {
        id: 16481,
        type: 'Ability',
        potency: 860,
    },
    SHOHA: {
        id: 16487,
        type: 'Ability',
        potency: 640,
        multihit: true,
        falloff: 0.65,
    },
    OGI_NAMIKIRI: {
        id: 25781,
        type: 'Weaponskill',
        potency: 900,
        multihit: true,
        falloff: 0.75,
    },
    KAESHI_NAMIKIRI: {
        id: 25782,
        type: 'Ability',
        potency: 900,
        multihit: true,
        falloff: 0.75,
    },
    HIGANBANA: {
        id: 7489,
        type: 'Weaponskill',
        potency: 200,
    },
    TENKA_GOKEN: {
        id: 7488,
        type: 'Weaponskill',
        potency: 300,
        multihit: true,
    },
    MIDARE_SETSUGEKKA: {
        id: 7487,
        type: 'Weaponskill',
        potency: 700,
    },
    KAESHI_HIGANBANA: {
        id: 16484,
        type: 'Ability',
        potency: 200,
    },
    KAESHI_GOKEN: {
        id: 16485,
        type: 'Weaponskill',
        potency: 300,
        multihit: true,
    },
    KAESHI_SETSUGEKKA: {
        id: 16486,
        type: 'Weaponskill',
        potency: 700,
    },
    TENDO_GOKEN: {
        id: 36965,
        type: 'Weaponskill',
        potency: 420,
        multihit: true,
    },
    TENDO_SETSUGEKKA: {
        id: 36966,
        type: 'Weaponskill',
        potency: 1020,
    },
    TENDO_KAESHI_GOKEN: {
        id: 36965,
        type: 'Weaponskill',
        potency: 420,
        multihit: true,
    },
    TENDO_KAESHI_SETSUGEKKA: {
        id: 36968,
        type: 'Weaponskill',
        potency: 1020,
    },
    ZANSHIN: {
        id: 36964,
        type: 'Ability',
        potency: 900,
        multihit: true,
        falloff: 0.6,
    },
})

export const STATUSES = preserve<Status>()({
    FUGETSU: {
        id: 1298,
    },
    MEIKYO_SHISUI: {
        id: 1233,
    },
})

export const DEBUFFS = preserve<Debuff>()({
    HIGANBANA: {
        id: 1228,
        potency: 50,
        castActions: [
            ACTIONS.HIGANBANA.id,
            ACTIONS.KAESHI_HIGANBANA.id,
        ],
    },
})
