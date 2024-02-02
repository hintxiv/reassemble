import { ApplyBuffEvent, ApplyDebuffEvent, RemoveBuffEvent, RemoveDebuffEvent } from 'api/fflogs/event'
import { RAIDBUFFS } from 'data/packs'
import { Status } from 'data/types'
import { Module } from 'simulator/modules/module'

/**
 * Represents an Entity in the report
 */
export abstract class Entity extends Module {
    public key: string
    protected activeStatuses: Set<Status['id']> = new Set()

    constructor(key: string) {
        super()
        this.key = key
    }

    protected hasStatus(statusID: number) {
        return this.activeStatuses.has(statusID)
    }

    protected onApplyStatus(event: ApplyBuffEvent | ApplyDebuffEvent) {
        this.activeStatuses.add(event.statusID)
        if (Object.values(RAIDBUFFS.STATUSES).map(status => status.id).includes(event.statusID)) {
            const buffKey = Object.entries(RAIDBUFFS.STATUSES).find(
                ([_, status]) => status.id === event.statusID
            )[0]
            console.log(`[${event.timestamp}] applied ${buffKey}`)
        }
    }

    protected onRemoveStatus(event: RemoveBuffEvent | RemoveDebuffEvent) {
        this.activeStatuses.delete(event.statusID)
        if (Object.values(RAIDBUFFS.STATUSES).map(status => status.id).includes(event.statusID)) {
            const buffKey = Object.entries(RAIDBUFFS.STATUSES).find(
                ([_, status]) => status.id === event.statusID
            )[0]
            console.log(`[${event.timestamp}] removed ${buffKey}`)
        }
    }
}
