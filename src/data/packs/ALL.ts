import {preserve} from 'utilities/types'
import {Action, Status} from '../types'

export const ACTIONS = preserve<Action>()({
    ATTACK: {
        id: 7,
        type: 'Auto',
        potency: 110,
    },
    SHOT: {
        id: 8,
        type: 'Auto',
        potency: 100,
    },
})

export const STATUSES = preserve<Status>()({

})
