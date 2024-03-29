import { DamageEvent } from 'api/fflogs/event'
import { BRD_INFO } from 'data/jobs/BRD'
import { BRD } from 'data/packs'
import { Buff } from 'simulator/buff'
import { DamageOptions } from 'simulator/damage'
import { Potency } from 'simulator/modules/potency'
import { Player } from '../player'

const RS: Buff = {
    statusID: BRD.STATUSES.RAGING_STRIKES.id,
    potency: 1.15,
}

export class Bard extends Player {
    jobInfo = BRD_INFO
    potency: Potency

    protected init() {
        super.init()

        this.potency = new Potency(this.casts)
        this.addDependency(this.potency)

        this.addBuff(RS)

        Object.values(BRD.ACTIONS).forEach(action => {
            this.addHandler('cast', action.id, this.onCast)
            this.addHandler('damage', action.id, this.onDamage)
        })

        Object.values(BRD.DEBUFFS).forEach(debuff => {
            this.addHandler('tick', debuff.id, this.onTick)
        })
    }

    private adjustPitchPerfect(event: DamageEvent) {
        const ppTiers = [100, 220, 360]

        return () => {
            const expectedPotency = this.potency.expectedPotency(event)

            // Figure out how many stacks of PP this event was most likely cast with
            const closestTier = ppTiers.reduce((a, b) => {
                return Math.abs(b - expectedPotency) < Math.abs(a - expectedPotency) ? b : a
            })

            return closestTier
        }
    }

    private adjustApexArrow(event: DamageEvent) {
        const potencyPerGauge = 5

        return () => {
            const expectedPotency = this.potency.expectedPotency(event)

            // Figure out how much gauge this event was most likely cast with
            const closestGauge = Math.ceil((expectedPotency / potencyPerGauge) / 5) * 5

            return Math.min(closestGauge, 100) * potencyPerGauge
        }
    }

    protected onDamage(event: DamageEvent) {
        const action = this.data.findAction(event.actionID)
        const options: DamageOptions = {}

        // Attach adjustments to the actions that need it
        if (action.id === BRD.ACTIONS.PITCH_PERFECT.id) {
            options.postAdjustment = this.adjustPitchPerfect(event)

        } else if (action.id === BRD.ACTIONS.APEX_ARROW.id) {
            options.postAdjustment = this.adjustApexArrow(event)
        }

        // Do the rest of the damage stuff
        super.onDamage(event, options)
    }
}
