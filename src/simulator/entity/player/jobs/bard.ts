import { BRD_INFO } from 'data/jobs/BRD'
import { BRD } from 'data/packs'
import { DamageEvent } from 'parse/fflogs/event'
import { Buff } from 'simulator/buff'
import { DamageOptions } from 'simulator/damage'
import { Player } from '../player'

const RS: Buff = {
    statusID: BRD.STATUSES.RAGING_STRIKES.id,
    potency: 1.1,
}

export class Bard extends Player {
    jobInfo = BRD_INFO
    potencyRatios: number[] = []

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

    private avgPotencyRatio() {
        const sum = this.potencyRatios.reduce((a, b) => a + b, 0)
        const avg = (sum / this.potencyRatios.length) || 0

        return avg
    }

    private adjustPitchPerfect = (event: DamageEvent, adjustedDamage: number) => {
        const ppTiers = [100, 250, 450]

        return () => {
            const expectedPotency = adjustedDamage / this.avgPotencyRatio()

            // Figure out how many stacks of PP this event was most likely cast with
            const closestTier = ppTiers.reduce((a, b) => {
                return Math.abs(b - expectedPotency) < Math.abs(a - expectedPotency) ? b : a
            })

            return closestTier
        }
    }

    private adjustApexArrow = (event: DamageEvent, adjustedDamage: number) => {
        const potencyPerGauge = 6

        return () => {
            const expectedPotency = adjustedDamage / this.avgPotencyRatio()

            // Figure out how much gauge this event was most likely cast with
            const closestGauge = Math.ceil((expectedPotency / potencyPerGauge) / 5) * 5

            return Math.min(closestGauge, 100) * 6
        }
    }

    protected onDamage(event: DamageEvent) {
        const key = this.getCastKey(event)

        if (!this.casts.has(key)) {
            console.warn('Damage event found without a matching cast')
            console.warn(event)
            return
        }

        const cast = this.casts.get(key)
        const action = this.data.findAction(event.actionID)

        // Get the damage modifier given by buffs
        const buffRatio = cast.buffs.reduce((total, b) => (b.potency || 1) * total, 1)

        // Get the damage modifier given by crits / DHs
        let modifier = 1
        if (event.isCrit) {
            // TODO get crit modifier from DoTs I guess?
            modifier *= 1000
        } if (event.isDH) {
            modifier *= 1.25
        }

        const adjustedDamage = event.amount / (buffRatio * modifier)
        const potencyRatio = adjustedDamage / action.potency

        // Record the potency-to-damage ratio
        this.potencyRatios.push(potencyRatio)

        const options: DamageOptions = {}

        // Attach adjustments to the actions that need it
        if (action.id === BRD.ACTIONS.PITCH_PERFECT.id) {
            options.postAdjustment = this.adjustPitchPerfect(event, adjustedDamage)

        } else if (action.id === BRD.ACTIONS.APEX_ARROW.id) {
            options.postAdjustment = this.adjustApexArrow(event, adjustedDamage)
        }

        // Do the rest of the damage stuff
        super.onDamage(event, options)
    }
}
