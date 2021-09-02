import { JobInfo } from 'data/jobs'
import { ALL } from 'data/packs'
import { Action, Status } from 'data/types'
import { CastEvent, DamageEvent, TickEvent } from 'parse/fflogs/event'
import { Buff } from 'simulator/buff'
import { CastInstance, DamageOptions } from 'simulator/damage'
import { CastKey } from 'simulator/modules/module'
import { CastHandler, DamageHandler } from '../../handlers'
import { RAID_BUFFS } from '../../raidbuffs'
import {  Entity } from '../entity'

export abstract class Player extends Entity {
    public jobInfo: JobInfo

    public id: number

    protected buffs: Map<Status['id'], Buff> = new Map()
    protected casts: Map<CastKey, CastInstance> = new Map()
    protected combos: Map<Action['id'], CastInstance> = new Map()

    protected castCallback: CastHandler
    protected damageCallback: DamageHandler

    constructor(id: number, castCallback: CastHandler, damageCallback: DamageHandler) {
        super(id.toString())

        this.id = id
        this.castCallback = castCallback
        this.damageCallback = damageCallback

        this.init()
    }

    protected init() {
        // Add handlers to maintain activeStatuses
        Object.values(this.data.statuses).forEach(status => {
            this.addHandler('applybuff', status.id, this.onApplyStatus)
            this.addHandler('removebuff', status.id, this.onRemoveStatus)
        })

        // Add handlers for common actions
        Object.values(ALL.ACTIONS).forEach(action => {
            this.addHandler('cast', action.id, this.onCast)
            this.addHandler('damage', action.id, this.onDamage)
        })

        // Add handlers for raid buffs
        RAID_BUFFS.forEach(buff => {
            this.addBuff(buff)
        })
    }

    public addCast(event: CastEvent, buffs: Buff[], options: DamageOptions = {}): CastInstance {
        const action = this.data.findAction(event.actionID)

        let comboed = false

        if (action.combo && this.combos.has(action.combo.from)) {
            // Check if we've seen the prior combo action
            const lastUsed = this.combos.get(action.combo.from).timestamp
            comboed = (event.timestamp - lastUsed < action.combo.duration * 1000)
        }

        let potency = action.potency

        if (comboed) {
            potency = action.combo.potency
        }
        if (options && options.addedPotency) {
            potency += options.addedPotency
        }

        const cast: CastInstance = {
            timestamp: event.timestamp,
            targetKey: event.targetKey,
            potency: potency,
            buffs: buffs,
            firstHit: true,
            options: options,
        }

        this.casts.set(this.getCastKey(event), cast)

        // Break combos
        if (action.breaksCombo) {
            this.combos.clear()
        }

        // Add new combo
        if (comboed || action.startsCombo) {
            this.combos.set(action.id, cast)
        }

        return cast
    }

    public addBuff(buff: Buff) {
        this.buffs.set(buff.statusID, buff)
    }

    public get activeBuffs(): Buff[] {
        const buffs = []

        for (const [statusID, buff] of this.buffs) {
            if (this.hasStatus(statusID)) {
                buffs.push(buff)
            }
        }

        return buffs
    }

    /**
     * Common event handlers below
     */
    protected onTick(event: TickEvent) {
        // TODO might need to check source/target IDs?
        const debuff = this.data.findDebuff(event.statusID)

        const snapshot = debuff.castActions
            .map(actionID => `${event.targetKey}-${actionID}`)
            .map((key: CastKey) => this.casts.get(key))
            .sort((cast1, cast2) => cast2.timestamp - cast1.timestamp)[0]

        this.damageCallback({
            type: 'DoT',
            timestamp: event.timestamp,
            potency: debuff.potency,
            buffs: snapshot.buffs,
            options: snapshot.options,
        })
    }

    protected onCast(event: CastEvent) {
        const cast = this.addCast(event, this.activeBuffs)
        this.castCallback(cast)
    }

    protected onDamage(event: DamageEvent, options?: DamageOptions) {
        const key = this.getCastKey(event)

        if (!this.casts.has(key)) {
            console.warn('Damage event found without a matching cast')
            console.warn(event)
            return
        }

        const cast = this.casts.get(key)
        const action = this.data.findAction(event.actionID)

        // Check if this hit has falloff
        let falloff = 0
        if (action.falloff && !cast.firstHit) {
            falloff = action.falloff
        }

        // Subsequent hits will have falloff
        cast.firstHit = false

        this.damageCallback({
            type: action.type,
            timestamp: event.timestamp,
            potency: cast.potency,
            buffs: this.casts.get(key).buffs,
            falloff: falloff,
            options: {...cast.options, ...options},
        })
    }
}
