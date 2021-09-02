import { critModFromRate } from 'math/functions'
import { DamageEvent, TickEvent } from 'parse/fflogs/event'
import { CastInstance } from 'simulator/damage'
import { CastKey, Module } from './module'

const DH_MULT = 1.25

export class Potency extends Module {
    private potencyEvents: DamageEvent[] = []
    private critRates: number[] = []
    private casts: Map<CastKey, CastInstance>

    constructor(casts: Map<CastKey, CastInstance>) {
        super()
        this.casts = casts
        this.init()
    }

    /**
     * Returns the average damage-to-potency ratio throughout the log
     *  after adjusting for buffs, crits, and DHs
     */
    public get potencyRatio(): number {
        const sum = this.potencyEvents
            .map(event => this.getAdjustedDamage(event) / this.data.findAction(event.actionID).potency)
            .reduce((a, b) => a + b, 0)

        const avg = sum / this.potencyEvents.length

        return avg
    }

    /**
     * Returns the expected potency the given event was cast with
     */
    public expectedPotency(event: DamageEvent): number {
        const adjustedDamage = this.getAdjustedDamage(event)

        return adjustedDamage / this.potencyRatio
    }

    protected init() {
        Object.values(this.data.actions).forEach(action => {
            this.addHandler('damage', action.id, this.onDamage)
        })
        Object.values(this.data.debuffs).forEach(action => {
            this.addHandler('tick', action.id, this.onTick)
        })
    }

    private get modeCritRate(): number {
        const counts: Record<number, number> = {}
        let mode = this.critRates[0]

        this.critRates.forEach(n => {
            if (!(n in counts)) {
                counts[n] = 1
            } else {
                counts[n]++
            }
            if (counts[n] > counts[mode]) {
                mode = n
            }
        })

        return mode
    }

    private get critModifier() {
        // Take the mode crit rate in case there are outliers
        const critRate = this.modeCritRate

        // TODO level stuff again lol
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return critModFromRate(critRate, 80)
    }

    private getAdjustedDamage(event: DamageEvent) {
        const key = this.getCastKey(event)

        if (!this.casts.has(key)) {
            throw new Error('Tried to calculate expected potency, but no matching cast was found.')
        }
        const cast = this.casts.get(key)

        // Get the damage modifier given by buffs
        const buffRatio = cast.buffs.reduce((total, b) => (b.potency ?? 1) * total, 1)

        // Get the damage modifier given by crits / DHs
        let modifier = 1
        if (event.isCrit) {
            // TODO get crit modifier from DoTs I guess?
            modifier *= this.critModifier
        } if (event.isDH) {
            modifier *= DH_MULT
        }

        return event.amount / (buffRatio * modifier)
    }

    private onDamage(event: DamageEvent) {
        const action = this.data.findAction(event.actionID)

        if (!action.potency || action.type === 'Auto') {
            // Auto damage uses a different formula, ignore it
            return
        }

        this.potencyEvents.push(event)
    }

    private onTick(event: TickEvent) {
        const debuff = this.data.findDebuff(event.statusID)

        const snapshot = debuff.castActions
            .map(actionID => `${event.targetKey}-${actionID}`)
            .map((key: CastKey) => this.casts.get(key))
            .sort((cast1, cast2) => cast2.timestamp - cast1.timestamp)[0]

        if (!snapshot) {
            throw new Error('Tried to calculate crit rate, but no matching snapshot was found.')
        }

        // Normalize buffs and store the decimal crit rate
        const critFromBuffs = snapshot.buffs.reduce((total, b) => (b.critRate ?? 0) + total, 0)
        const critRate = event.expectedCritRate / 1000 - critFromBuffs

        this.critRates.push(critRate)
    }
}
