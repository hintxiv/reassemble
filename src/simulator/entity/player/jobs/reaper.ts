import { CastEvent } from 'api/fflogs/event'
import { RPR_INFO } from 'data/jobs/RPR'
import { RPR } from 'data/packs'
import { Buff } from 'simulator/buff'
import { DamageOptions } from 'simulator/damage'
import { Player } from '../player'

const ENHANCED_ACTIONS = [
    RPR.ACTIONS.GIBBET.id,
    RPR.ACTIONS.GALLOWS.id,
    RPR.ACTIONS.VOID_REAPING.id,
    RPR.ACTIONS.CROSS_REAPING.id,
]

const DEATHS_DESIGN: Buff = {
    statusID: RPR.DEBUFFS.DEATHS_DESIGN.id,
    potency: 1.1,
}

export class Reaper extends Player {
    jobInfo = RPR_INFO
    debuffs = [DEATHS_DESIGN]

    protected init() {
        super.init()

        Object.values(RPR.ACTIONS).forEach(action => {
            if (ENHANCED_ACTIONS.includes(action.id)) {
                this.addHandler('cast', action.id, this.onReaver)
            } else {
                this.addHandler('cast', action.id, this.onCast)
            }

            this.addHandler('damage', action.id, this.onDamage)
        })
    }

    private onReaver(event: CastEvent) {
        const buffs = this.activeBuffs
        const damageOptions: DamageOptions = {}

        if ((event.actionID === RPR.ACTIONS.GIBBET.id && this.hasStatus(RPR.STATUSES.ENHANCED_GIBBET.id))
        || (event.actionID === RPR.ACTIONS.GALLOWS.id && this.hasStatus(RPR.STATUSES.ENHANCED_GALLOWS.id))
        || (event.actionID === RPR.ACTIONS.VOID_REAPING.id && this.hasStatus(RPR.STATUSES.ENHANCED_VOID_REAPING.id))
        || (event.actionID === RPR.ACTIONS.CROSS_REAPING.id && this.hasStatus(RPR.STATUSES.ENHANCED_CROSS_REAPING.id))) {
            damageOptions.addedPotency = 60
        }

        this.addCast(event, buffs, damageOptions)
    }
}
