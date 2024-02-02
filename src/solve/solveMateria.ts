import { Gear, Gearset } from 'simulator/gear/gear'
import { Stats } from 'simulator/gear/stats'
import { Simulator } from 'simulator/simulator'

/**
 * Do not use this
 */

const STAT_OVERCAP_LIMIT = 4 // allow meld combinations that overcap this much stat

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

function getMeldCombos(gear: Gear, slotsAvailable: number, meldsSoFar: Melds, sksReq: number): Melds[] {
    const meldAmount = gear.gearGroup === 'accessory'
        ? (slotsAvailable > 2 ? 12 : 36)
        : (slotsAvailable > 3 ? 12 : 36)

    const combos = new MeldSet()

    const possibilities: Array<keyof Stats> = ['critical', 'direct', 'determination']
    if (!meldsSoFar.stats.skillspeed || meldsSoFar.stats.skillspeed < sksReq) {
        possibilities.push('skillspeed')
    }

    for (const meld of possibilities) {
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
            for (const combo of getMeldCombos(gear, slotsAvailable - 1, newMelds, sksReq)) {
                combos.add(combo)
            }
        }
    }

    return combos.combos
}

function makeMeldSets(gearset: Gearset, sksReq: number): Melds[][] {
    const meldSets = []

    for (const gear of gearset.gear) {
        let meldSlots

        // TODO we can pull this from etro?
        if (gear.advancedMelding) {
            meldSlots = 5
            // Hardcode for adding certain melds to specific slots
            //if (gear.name === "Classical Ring of Aiming") {
            //    meldSlots = 4
            //}
        } else if (gear.gearGroup === 'weapon') {
            meldSlots = 0 // override
        } else if (gear.name === 'Purgatory Earrings of Aiming' || (gear.gearGroup === 'accessory' && gear.name.startsWith('Voidmoon'))) {
            meldSlots = 1
        } else if (gear.gearGroup === 'accessory') {
            meldSlots = 2
        } else {
            meldSlots = 2
        }

        if (meldSlots > 0) {
            const meldCombos = getMeldCombos(gear, meldSlots, { stats: {}, gear: [] }, sksReq)
            meldSets.push(meldCombos)
        }
    }

    return meldSets
}

function makeCombos(gearset: Gearset, sksReq: number): Melds[] {
    const meldSets = makeMeldSets(gearset, sksReq)
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

export async function solveMateria(gearset: Gearset, simulator: Simulator, recast: number): Promise<Gearset> {
    const sksReq = 0  // TODO get sks/sps requirement from user input GCD recast
    const meldSets = makeCombos(gearset, sksReq)

    const strippedStats: Stats = { ...gearset.stats }

    // Remove existing materia
    for (const gear of gearset.gear) {
        if (gear.materiaStats) {
            for (const stat of Object.keys(gear.materiaStats)) {
                strippedStats[stat as keyof Stats] -= gear.materiaStats[stat as keyof Stats]
            }
        }
    }

    let best
    let bestDamage = 0

    for (const melds of meldSets) {
        if ((!melds.stats.skillspeed && sksReq > 0) || melds.stats.skillspeed < sksReq) { continue }

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

    const bestStats = { ...strippedStats }

    // Apply meld set
    for (const stat of Object.keys(best.stats)) {
        bestStats[stat as keyof Stats] += best.stats[stat as keyof Stats]
    }

    console.log(bestStats)

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

    console.log(recast)

    return gearset
}
