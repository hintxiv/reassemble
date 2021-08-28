import { Status } from 'data/types'
import {
    ApplyBuffEvent,
    ApplyDebuffEvent,
    CastEvent,
    DamageEvent,
    RemoveBuffEvent,
    RemoveDebuffEvent,
} from 'parse/fflogs/event'
import { Module } from 'simulator/modules/module'

export type CastKey = `${number}-${number}`  // TargetID - ActionID

/**
 * Represents an Entity in the report
 */
export abstract class Entity extends Module {
    public key: string
    protected activeStatuses: Set<Status['id']> = new Set()

    constructor(key: string, deps?: Module[]) {
        super(deps)
        this.key = key
    }

    protected hasStatus(statusID: number) {
        return this.activeStatuses.has(statusID)
    }

    protected getCastKey(event: CastEvent | DamageEvent): CastKey {
        // For multitarget casts, forgo the targetID distinction
        const action = this.data.findAction(event.actionID)
        const targetID = action.multihit ? '' : event.targetKey

        return `${targetID}-${event.actionID}` as CastKey
    }

    protected onApplyStatus(event: ApplyBuffEvent | ApplyDebuffEvent) {
        this.activeStatuses.add(event.statusID)
    }

    protected onRemoveStatus(event: RemoveBuffEvent | RemoveDebuffEvent) {
        this.activeStatuses.delete(event.statusID)
    }
}
