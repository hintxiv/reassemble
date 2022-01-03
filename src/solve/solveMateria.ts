import { Gear, Gearset } from 'simulator/gear/gear'
import { Stats } from 'simulator/gear/stats'
import { Simulator } from 'simulator/simulator'

/**
 * This is all exploratory work, not really intended for use yet
 */


const STAT_OVERCAP_LIMIT = 2 // allow meld combinations that overcap this much stat

interface Melds {
    stats: Partial<Stats>
    gear: Array<{
        name: string
        melds: Partial<Stats>
    }>
}

function copyMelds(melds: Melds): Melds {
    return {
        stats: {...melds.stats},
        gear: melds.gear.map(gear => ({
            name: gear.name,
            melds: {...gear.melds},
        })),
    }
}

class MeldSet {
    public combos: Melds[] = []
    private set: Set<string> = new Set()

    public add(melds: Melds) {
        const json = JSON.stringify(melds.stats)
        if (!this.set.has(json)) {
            this.set.add(json)
            this.combos.push(melds)
        }
    }

    public get length() {
        return this.combos.length
    }
}

function getMeldCombos(gear: Gear, slotsAvailable: number, meldsSoFar: Melds): Melds[] {
    const meldAmount = gear.gearGroup === 'accessory'
        ? (slotsAvailable > 2 ? 12 : 36)
        : (slotsAvailable > 3 ? 12 : 36)

    const combos = new MeldSet()

    for (const meld of ['critical', 'direct', 'determination'] as Array<keyof Stats>) {
        if (gear.stats[meld] + (meldsSoFar.stats[meld] ?? 0) + meldAmount > gear.maxSubstat + STAT_OVERCAP_LIMIT) { continue }

        const newMelds = copyMelds(meldsSoFar)

        if (meld in meldsSoFar.stats) {
            newMelds.stats[meld] += Math.min(gear.maxSubstat - newMelds.stats[meld] - (gear.stats[meld] ?? 0), meldAmount)
        } else {
            newMelds.stats[meld] = Math.min(gear.maxSubstat - (gear.stats[meld] ?? 0), meldAmount)
        }

        newMelds.gear.push({
            name: gear.name,
            melds: { [meld]: meldAmount },
        })

        if (slotsAvailable === 1) {
            combos.add(newMelds)

        } else {
            for (const combo of getMeldCombos(gear, slotsAvailable - 1, newMelds)) {
                combos.add(combo)
            }
        }
    }

    return combos.combos
}

function makeMeldSets(gearset: Gearset): Melds[][] {
    const meldSets = []

    for (const gear of gearset.gear) {
        let meldSlots
        if (gear.advancedMelding) {
            meldSlots = 5
        } else if (gear.gearGroup === 'accessory') {
            meldSlots = 1
        } else {
            meldSlots = 2
        }

        meldSets.push(getMeldCombos(gear, meldSlots, { stats: {}, gear: [] }))
    }

    return meldSets
}

function makeCombos(gearset: Gearset): Melds[] {
    const meldSets = makeMeldSets(gearset)
    let currentMelds = new MeldSet()

    for (const melds of meldSets[0]) {
        currentMelds.add(melds)
    }

    for (let i = 1; i < meldSets.length; i++) {
        const nextMelds = new MeldSet()

        for (const melds1 of currentMelds.combos) {
            for (const melds2 of meldSets[i]) {
                const newMelds = copyMelds(melds1)
                for (const stat of Object.keys(melds2.stats)) {
                    if (stat in newMelds.stats) {
                        newMelds.stats[stat as keyof Stats] += melds2.stats[stat as keyof Stats]
                    } else {
                        newMelds.stats[stat as keyof Stats] = melds2.stats[stat as keyof Stats]
                    }
                }
                newMelds.gear.push(...melds2.gear)
                nextMelds.add(newMelds)
            }
        }

        currentMelds = nextMelds
        console.log(`Finished enumerating melds on piece ${i}, there's a total of ${currentMelds.combos.length} possibilities`)
    }

    return currentMelds.combos
}

export async function solveMateria(gearset: Gearset, simulator: Simulator): Promise<Stats> {
    const meldSets = makeCombos(gearset)

    const strippedStats: Stats = { ...gearset.stats }

    // Remove existing materia
    for (const gear of gearset.gear) {
        for (const stat of Object.keys(gear.materiaStats)) {
            strippedStats[stat as keyof Stats] -= gear.materiaStats[stat as keyof Stats]
        }
    }

    let best
    let bestDamage = (await simulator.calculateDamage(gearset.stats)).expected

    for (const melds of meldSets) {
        const newStats = { ...strippedStats }

        // Apply meld set
        for (const stat of Object.keys(melds.stats)) {
            newStats[stat as keyof Stats] += melds.stats[stat as keyof Stats]
        }

        const damage = (await simulator.calculateDamage(newStats)).expected
        if (damage > bestDamage) {
            best = melds
            bestDamage = damage
        }
    }

    console.log(best)
    console.log(bestDamage)

    let currentGear = best.gear[0].name
    let currentStats: Partial<Stats> = {}

    for (const gear of best.gear) {
        if (gear.name !== currentGear) {
            console.log(currentGear)
            console.log(currentStats)
            currentGear = gear.name
            currentStats = {}
        }

        for (const stat of Object.keys(gear.melds)) {
            if (stat in currentStats) {
                currentStats[stat as keyof Stats] += gear.melds[stat as keyof Stats]
            } else {
                currentStats[stat as keyof Stats] = gear.melds[stat as keyof Stats]
            }
        }
    }

    console.log(currentGear)
    console.log(currentStats)

    return gearset.stats
}
