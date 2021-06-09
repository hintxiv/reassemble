import { BRD_INFO } from 'data/jobs/BRD'
import { BRD } from 'data/packs'
import { Buff } from 'simulator/buff'
import { Player } from '../player'

const RS: Buff = {
    statusID: BRD.STATUSES.RAGING_STRIKES.id,
    potency: 1.1,
}

export class Bard extends Player {
    jobInfo = BRD_INFO

    protected init() {
        super.init()

        this.addBuff(RS)

        Object.values(BRD.ACTIONS).forEach(action => {
            this.addHandler('cast', action.id, this.onCast)
            this.addHandler('damage', action.id, this.onDamage)
        })

        Object.values(BRD.DEBUFFS).forEach(debuff => {
            this.addHandler('tick', debuff.id, this.onTick)
        })
    }
}
