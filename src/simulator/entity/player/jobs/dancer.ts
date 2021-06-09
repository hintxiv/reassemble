import { DNC_INFO } from 'data/jobs/DNC'
import { DNC } from 'data/packs'
import { Buff } from 'simulator/buff'
import { Player } from '../player'

const STANDARD_FINISH: Buff = {
    statusID: DNC.STATUSES.STANDARD_FINISH.id,
    potency: 1.05,
}

const DEVILMENT: Buff = {
    statusID: DNC.STATUSES.DEVILMENT.id,
    critRate: 0.2,
    directRate: 0.2,
}

export class Dancer extends Player {
    jobInfo = DNC_INFO

    protected init() {
        super.init()

        this.addBuff(STANDARD_FINISH)
        this.addBuff(DEVILMENT)

        Object.values(DNC.ACTIONS).forEach(action => {
            this.addHandler('cast', action.id, this.onCast)
            this.addHandler('damage', action.id, this.onDamage)
        })
    }
}
