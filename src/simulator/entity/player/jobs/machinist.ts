import { MCH_INFO } from 'data/jobs/MCH'
import { MCH } from 'data/packs'
import { CastEvent } from 'parse/fflogs/event'
import { Buff } from 'simulator/buff'
import { Player } from '../player'

const REASSEMBLED: Buff = {
    statusID: MCH.STATUSES.REASSEMBLED.id,
    critRate: 1,
    directRate: 1,
}

const PET_ACTIONS = [
    MCH.ACTIONS.ARM_PUNCH.id,
    MCH.ACTIONS.ROLLER_DASH.id,
    MCH.ACTIONS.PILE_BUNKER.id,
]

const BATTERY_GEN = {
    [MCH.ACTIONS.HEATED_CLEAN_SHOT.id]: 10,
    [MCH.ACTIONS.AIR_ANCHOR.id]: 20,
    [MCH.ACTIONS.CHAIN_SAW.id]: 20,
}

// No status for this, need to fake it
const HYPERCHARGE_DURATION_MS = 8000

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
        this.addCast(event, this.activeBuffs, { noCrit: true, noDirect: true })
    }

    private onSummon() {
        this.queenSummonedAt = this.battery
        this.battery = 0
    }

    private onBatteryCast(event: CastEvent) {
        this.battery = Math.min(100, this.battery + BATTERY_GEN[event.actionID])
        this.onCast(event)
    }

    private onWeaponskillCast(event: CastEvent) {
        const buffs = this.activeBuffs
        let addedPotency = 0

        if (this.hasStatus(MCH.STATUSES.REASSEMBLED.id)) {
            buffs.push(REASSEMBLED)
        }

        if (event.timestamp < this.lastHypercharge + HYPERCHARGE_DURATION_MS) {
            // Hypercharge up, single target weaponskills get buffed
            if (!this.data.findAction(event.actionID).multihit) {
                addedPotency = 20
            }
        }

        this.addCast(event, buffs, { addedPotency: addedPotency })
    }

    private onPetCast(event: CastEvent) {
        const pet = 'Automaton Queen'

        if (event.actionID === MCH.ACTIONS.PILE_BUNKER.id) {
            const addedPotency = ((this.queenSummonedAt - 50) * 6.5)
            this.addCast(event, this.activeBuffs, { addedPotency: addedPotency, pet: pet })

        } else if (event.actionID === MCH.ACTIONS.CROWNED_COLLIDER.id) {
            const addedPotency = ((this.queenSummonedAt - 50) * 7.5)
            this.addCast(event, this.activeBuffs, { addedPotency: addedPotency, pet: pet })

        } else {
            this.addCast(event, this.activeBuffs, { pet: pet })
        }
    }
}
