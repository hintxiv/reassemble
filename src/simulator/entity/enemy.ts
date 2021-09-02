import { Status } from 'data/types'
import { Buff } from 'simulator/buff'
import { RAID_DEBUFFS } from 'simulator/raidbuffs'
import { Entity } from './entity'

/**
 * Represents an Enemy entity in the report
 */
export class Enemy extends Entity {
    private debuffs: Map<Status['id'], Buff> = new Map()

    constructor(targetKey: string) {
        super(targetKey)
        this.init()
    }

    protected init() {
        // Add handlers for raid debuffs (chain, trick...)
        RAID_DEBUFFS.forEach(debuff => {
            this.debuffs.set(debuff.statusID, debuff)
            this.addHandler('applydebuff', debuff.statusID, this.onApplyStatus)
            this.addHandler('removedebuff', debuff.statusID, this.onRemoveStatus)
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
