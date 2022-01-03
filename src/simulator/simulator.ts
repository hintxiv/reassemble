import { JOBS } from 'data/jobs'
import { expectedDamage } from 'functions/damage'
import { FFLogsEvent } from 'parse/fflogs/event'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import { DamageInstance } from 'simulator/damage'
import { Enemy, Player } from 'simulator/entity'
import { Stats } from 'simulator/gear/stats'
import { RAID_DEBUFFS } from 'simulator/raidbuffs'
import { CastHandler, DamageHandler } from './handlers'

export class Simulator {
    public player: Player

    private parser: FFLogsParser
    private damageInstances: DamageInstance[] = []
    private enemies: Map<string, Enemy> = new Map()

    constructor(parser: FFLogsParser, player: Friend) {
        this.parser = parser

        const playerCtor = JOBS[player.type].playerCtor
        this.player = new playerCtor(player.id, this.handleCastInstance, this.handleDamageInstance)
    }

    /**
     * Callback to notify the simulator of a new cast by the player
     */
    private handleCastInstance: CastHandler = (cast) => {
        const enemy = this.enemies.get(cast.targetKey)
        if (enemy) {
            cast.buffs.push(...enemy.activeDebuffs)
        }
    }

    /**
     * Callback to notify the simulator of a new damage instance
     */
    private handleDamageInstance: DamageHandler = (damage) => {
        this.damageInstances.push(damage)
    }

    private async processEvent(event: FFLogsEvent): Promise<void> {
        if (this.enemies.has(event.targetKey)) {
            this.enemies.get(event.targetKey).processEvent(event)

        } else if (!this.parser.fight.friends.some(friend => friend.id === event.targetID)) {
            const newEnemy = new Enemy(event.targetKey, this.player.debuffs)
            this.enemies.set(event.targetKey, newEnemy)
            newEnemy.processEvent(event)
        }

        this.player.processEvent(event)
    }

    private async extractDamage(): Promise<void> {
        const debuffIDs = RAID_DEBUFFS
            .map(debuff => debuff.statusID)

        const events = this.parser.getEvents(this.player.id, debuffIDs)

        for await (const event of events) {
            this.processEvent(event)
        }
    }

    /**
     * Computes expected damage for each damage event using the given Stats
     */
    public async calculateDamage(stats: Stats) {
        // Cache damage instances from the report
        if (this.damageInstances.length === 0) {
            await this.extractDamage()
        }

        let totalDamage = 0
        let lastDamageTime = 0
        const damageArray: Array<{ x: number, y: number }> = []

        this.damageInstances.forEach(instance => {
            // Adjust potency if the job logic specifies it
            if (instance.options.postAdjustment) {
                instance.potency = instance.options.postAdjustment()
            }

            // TODO level stuff (90 assumed for now)
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            const damage = expectedDamage(instance, this.player.jobInfo, 90, stats)
            totalDamage += damage

            const timeSoFar = (instance.timestamp - this.parser.fight.start) / 1000

            // Add a new data point to the graph at most every 2 seconds
            if (timeSoFar > lastDamageTime + 2) {
                const dpsSoFar = totalDamage / timeSoFar
                damageArray.push({ x: timeSoFar, y: dpsSoFar })
                lastDamageTime = timeSoFar
            }
        })

        const duration = (this.parser.fight.end - this.parser.fight.start) / 1000
        const expected = totalDamage / duration

        return {
            data: damageArray,
            expected: expected,
            total: totalDamage,
        }
    }
}
