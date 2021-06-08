import { Status } from 'data/types'
import { ApplyBuffEvent, ApplyDebuffEvent } from 'parse/fflogs/event'
import { Buff } from 'simulator/buff'
import { RAID_DEBUFFS } from 'simulator/raidbuffs'
import { Entity } from './entity'

/**
 * Represents an Enemy entity in the report
 * @param targetID - FFLogs actor ID
 * @param targetInstance - FFLogs target instance, may or may not exist
 */
export class Enemy extends Entity
{
    private debuffs: Map<Status['id'], Buff> = new Map()

    constructor(id: string, instance: string) {
        super(`${id}-${instance}`)
        this.init()
    }

    protected init() {
        // Add handlers for raid debuffs (chain, trick...)
        RAID_DEBUFFS.forEach(debuff => {
            this.debuffs.set(debuff.statusID, debuff)
            this.addHandler("applydebuff", debuff.statusID, this.onApplyStatus)
            this.addHandler("removedebuff", debuff.statusID, this.onRemoveStatus)
        })
    }

    public get activeDebuffs(): Buff[] {
        const debuffs = []

        for (const [statusID, debuff] of this.debuffs) {
            if (this.hasStatus(statusID)) {
                debuffs.push(debuff)
            }
        }

        return debuffs
    }
}
