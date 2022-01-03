import { ALL, BRD, DNC, MCH, RPR, RAIDBUFFS } from './packs'
import { Action, Debuff, Status } from './types'

const ACTIONS = {
    ...ALL.ACTIONS,
    ...BRD.ACTIONS,
    ...DNC.ACTIONS,
    ...MCH.ACTIONS,
    ...RPR.ACTIONS,
}

const STATUSES = {
    ...ALL.STATUSES,
    ...BRD.STATUSES,
    ...DNC.STATUSES,
    ...MCH.STATUSES,
    ...RPR.STATUSES,
    ...RAIDBUFFS.STATUSES,
}

const DEBUFFS = {
    ...BRD.DEBUFFS,
    ...MCH.DEBUFFS,
    ...RPR.DEBUFFS,
}

/**
 * Just a passthrough for easy importing / access to data
 */
export class DataProvider {
    private actionMap = new Map<number, Action>()
    private statusMap = new Map<number, Status>()
    private debuffMap = new Map<number, Debuff>()

    public get actions() {
        return ACTIONS
    }

    public get statuses() {
        return STATUSES
    }

    public get debuffs() {
        return DEBUFFS
    }

    constructor() {
        Object.values(this.actions).forEach(action => {
            this.actionMap.set(action.id, action)
        })

        Object.values(this.statuses).forEach(status => {
            this.statusMap.set(status.id, status)
        })

        Object.values(this.debuffs).forEach(debuff => {
            this.debuffMap.set(debuff.id, debuff)
        })
    }

    public findAction(actionID: number): Action | undefined {
        return this.actionMap.get(actionID)
    }

    public findStatus(statusID: number): Status | undefined {
        return this.statusMap.get(statusID)
    }

    public findDebuff(statusID: number): Debuff | undefined {
        return this.debuffMap.get(statusID)
    }
}
