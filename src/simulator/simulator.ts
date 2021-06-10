import { JOBS } from 'data/jobs'
import { expectedDamage } from 'math/damage'
import { FFLogsEvent } from 'parse/fflogs/event'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import { DamageInstance } from 'simulator/damage'
import { Enemy, Player } from 'simulator/entity'
import { Stats } from 'simulator/entity/player/stats'
import { RAID_DEBUFFS } from 'simulator/raidbuffs'
import { CastHandler, DamageHandler } from './handlers'

export class Simulator {
    private parser: FFLogsParser
    private damageInstances: DamageInstance[] = []

    private player: Player
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
        const [targetID, targetInstance] = event.targetKey.split('-')

        if (this.enemies.has(event.targetKey)) {
            this.enemies.get(event.targetKey).processEvent(event)

        } else if (!this.parser.fight.friends.some(friend => friend.id === +targetID)) {
            const newEnemy = new Enemy(targetID, targetInstance)
            this.enemies.set(event.targetKey, newEnemy)
            newEnemy.processEvent(event)
        }

        this.player.processEvent(event)
    }

    private async extractDamage(): Promise<void> {
        const debuffIDs = RAID_DEBUFFS
            .map(debuff => debuff.statusID)

        const eventGenerator = this.parser.getEvents(this.player.id, debuffIDs)

        for await (const event of eventGenerator) {
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
        const damageArray: Array<{ x: number, y: number }> = []

        this.damageInstances.forEach(instance => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            const damage = expectedDamage(instance, this.player.jobInfo, 80, stats)
            totalDamage += damage

            const timeSoFar = (instance.timestamp - this.parser.fight.start) / 1000
            const dpsSoFar = totalDamage / timeSoFar

            damageArray.push({ x: timeSoFar, y: dpsSoFar })
        })

        const duration = (this.parser.fight.end - this.parser.fight.start) / 1000
        const expected = totalDamage / duration

        return {
            data: damageArray,
            expected: expected,
        }
    }
}
