import { CastEvent } from 'api/fflogs/event'
import { MCH_INFO } from 'data/jobs/MCH'
import { MCH } from 'data/packs'
import { DamageOptions } from 'simulator/damage'
import { Player } from '../player'

const PET_ACTIONS = [
    MCH.ACTIONS.ARM_PUNCH.id,
    MCH.ACTIONS.ROLLER_DASH.id,
    MCH.ACTIONS.PILE_BUNKER.id,
    MCH.ACTIONS.CROWNED_COLLIDER.id,
]

const BATTERY_GEN = {
    [MCH.ACTIONS.HEATED_CLEAN_SHOT.id]: 10,
    [MCH.ACTIONS.AIR_ANCHOR.id]: 20,
    [MCH.ACTIONS.CHAIN_SAW.id]: 20,
    [MCH.ACTIONS.EXCAVATOR.id]: 20,
}

const BATTERY_POTENCY_MAP = {
    [MCH.ACTIONS.ARM_PUNCH.id]: 2.4,
    [MCH.ACTIONS.ROLLER_DASH.id]: 4.8,
    [MCH.ACTIONS.PILE_BUNKER.id]: 6.8,
    [MCH.ACTIONS.CROWNED_COLLIDER.id]: 7.8,
}

// No status for this, need to fake it
const HYPERCHARGE_DURATION_MS = 10000

export class Machinist extends Player {
    jobInfo = MCH_INFO

    private battery: number = 0
    private queenSummonedAt: number = 0
    private lastHypercharge: number = 0

    protected init() {
        super.init()

        Object.values(MCH.ACTIONS).forEach(action => {
            if (PET_ACTIONS.includes(action.id)) {
                this.addHandler('cast', action.id, this.onPetCast)
            } else if (action.type === 'Weaponskill') {
                this.addHandler('cast', action.id, this.onWeaponskillCast)
            } else {
                this.addHandler('cast', action.id, this.onCast)
            }

            this.addHandler('damage', action.id, this.onDamage)
        })

        Object.values(MCH.DEBUFFS).forEach(debuff => {
            this.addHandler('tick', debuff.id, this.onTick)
        })

        this.addHandler('cast', MCH.ACTIONS.WILDFIRE.id, this.onWildfireCast)
        this.addHandler('cast', MCH.ACTIONS.AUTOMATON_QUEEN.id, this.onSummon)
        this.addHandler('cast', MCH.ACTIONS.HEATED_CLEAN_SHOT.id, this.onBatteryCast)
        this.addHandler('cast', MCH.ACTIONS.AIR_ANCHOR.id, this.onBatteryCast)
        this.addHandler('cast', MCH.ACTIONS.CHAIN_SAW.id, this.onBatteryCast)
    }

    private onWildfireCast(event: CastEvent) {
        this.addCast(event, this.activeBuffs, { critType: 'none', dhType: 'none' })
    }

    private onSummon() {
        this.queenSummonedAt = this.battery
        this.battery = 0
    }

    private onBatteryCast(event: CastEvent) {
        this.battery = Math.min(100, this.battery + BATTERY_GEN[event.actionID])
        this.onWeaponskillCast(event)
    }

    private onWeaponskillCast(event: CastEvent) {
        const buffs = this.activeBuffs
        const options: DamageOptions = {}

        if (event.actionID === this.data.actions.FULL_METAL_FIELD.id || this.hasStatus(this.data.statuses.REASSEMBLED.id)) {
            options.critType = 'auto'
            options.dhType = 'auto'
        }

        if (event.timestamp < this.lastHypercharge + HYPERCHARGE_DURATION_MS) {
            // Hypercharge up, single target weaponskills get buffed
            if (!this.data.findAction(event.actionID).multihit) {
                options.addedPotency = 20
            }
        }

        this.addCast(event, buffs, options)
    }

    private onPetCast(event: CastEvent) {
        const extraBattery = this.queenSummonedAt - 50
        const addedPotency = extraBattery * BATTERY_POTENCY_MAP[event.actionID]

        this.addCast(event, this.activeBuffs, {
            addedPotency: addedPotency,
            pet: 'Automaton Queen',
        })
    }
}
