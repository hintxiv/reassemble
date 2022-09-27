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
})
