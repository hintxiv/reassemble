import { CastEvent } from 'api/fflogs/event'
import { MNK_INFO } from 'data/jobs/MNK'
import { MNK } from 'data/packs'
import { Buff } from 'simulator/buff'
import { DamageOptions } from 'simulator/damage'
import { Player } from '../player'

const RIDDLE_OF_FIRE: Buff = {
    statusID: MNK.STATUSES.RIDDLE_OF_FIRE.id,
    potency: 1.15,
}

const DISCIPLINED_FIST: Buff = {
    statusID: MNK.STATUSES.DISCIPLINED_FIST.id,
    potency: 1.15,
}

export class Monk extends Player {
    jobInfo = MNK_INFO

    protected init() {
        super.init()

        this.addBuff(RIDDLE_OF_FIRE)
        this.addBuff(DISCIPLINED_FIST)

        Object.values(MNK.ACTIONS).forEach(action => {
            if (action.id === MNK.ACTIONS.BOOTSHINE.id) {
                this.addHandler('cast', action.id, this.onBootshineCast)
            } else {
                this.addHandler('cast', action.id, this.onCast)
            }

            this.addHandler('damage', action.id, this.onDamage)
        })

        Object.values(MNK.DEBUFFS).forEach(debuff => {
            this.addHandler('tick', debuff.id, this.onTick)
        })
    }

    private onBootshineCast(event: CastEvent) {
        const options: DamageOptions = {}

        if (this.hasStatus(MNK.STATUSES.LEADEN_FIST.id)) {
            options.addedPotency = 100
        }

        if (this.hasStatus(MNK.STATUSES.OPO_OPO_FORM.id) || this.hasStatus(MNK.STATUSES.FORMLESS_FIST.id)) {
            options.critType = 'auto'
        }

        this.addCast(event, this.activeBuffs, options)
    }
}
