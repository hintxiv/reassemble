import { CastEvent } from 'api/fflogs/event'
import { SAM_INFO } from 'data/jobs/SAM'
import { SAM } from 'data/packs'
import { Buff } from 'simulator/buff'
import { Player } from '../player'

const FUGETSU: Buff = {
    statusID: SAM.STATUSES.FUGETSU.id,
    potency: 1.13,
}

const AUTO_CRIT_ACTIONS = [
    SAM.ACTIONS.MIDARE_SETSUGEKKA.id,
    SAM.ACTIONS.KAESHI_SETSUGEKKA.id,
    SAM.ACTIONS.OGI_NAMIKIRI.id,
    SAM.ACTIONS.KAESHI_NAMIKIRI.id,
]

export class Samurai extends Player {
    jobInfo = SAM_INFO

    protected init() {
        super.init()

        this.addBuff(FUGETSU)

        Object.values(SAM.ACTIONS).forEach(action => {
            if (AUTO_CRIT_ACTIONS.includes(action.id)) {
                this.addHandler('cast', action.id, this.onAutoCrit)
            } else {
                this.addHandler('cast', action.id, this.onCast)
            }
            this.addHandler('damage', action.id, this.onDamage)
        })

        Object.values(SAM.DEBUFFS).forEach(debuff => {
            this.addHandler('tick', debuff.id, this.onTick)
        })
    }

    private onAutoCrit(event: CastEvent) {
        this.addCast(event, this.activeBuffs, { critType: 'auto' })
    }
}
