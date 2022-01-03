import { Gear, Gearset } from 'simulator/gear/gear'
import { Stats } from 'simulator/gear/stats'
import { Simulator } from 'simulator/simulator'

const STAT_OVERCAP_LIMIT = 2 // allow meld combinations that overcap this much stat

interface Combo {
    stats: Stats
    melds: Array<{ name: string, melds: Partial<Stats> }>
}

class ComboSet {
    public combos: Combo[] = []
    private set: Set<string> = new Set()

    public add(combo: Combo) {
        const json = JSON.stringify(combo.stats)
        if (!this.set.has(json)) {
            this.set.add(json)
            this.combos.push(combo)
        }
    }

    public get length() {
        return this.combos.length
    }
}

function getMeldCombos(gear: Gear, combo: Combo, slotsAvailable: number, meldsSoFar: Partial<Stats> = {}): Combo[] {
    const meldAmount = gear.gearGroup === 'accessory'
        ? (slotsAvailable > 2 ? 12 : 36)
        : (slotsAvailable > 3 ? 12 : 36)

    const combos = new ComboSet()

    for (const meld of ['critical', 'direct', 'determination'] as Array<keyof Stats>) {
        if (gear.stats[meld] + meldsSoFar[meld] + meldAmount > gear.maxSubstat - STAT_OVERCAP_LIMIT) { continue }

        const newMelds = Object.assign({}, meldsSoFar)

        if (meld in meldsSoFar) {
            newMelds[meld] += Math.min(gear.maxSubstat - newMelds[meld] - (gear.stats[meld] ?? 0), meldAmount)
        } else {
            newMelds[meld] = Math.min(gear.maxSubstat - (gear.stats[meld] ?? 0), meldAmount)
        }

        if (slotsAvailable === 1) {
            const newCombo = {
                stats: { ...combo.stats },
                melds: combo.melds.slice(0),
            }

            for (const stat of Object.keys(newMelds)) {
                newCombo.stats[stat as keyof Stats] += newMelds[stat as keyof Stats]
            }

            newCombo.melds.push({ name: gear.name, melds: newMelds })
            combos.add(newCombo)

        } else {
            for (const newCombo of getMeldCombos(gear, combo, slotsAvailable - 1, newMelds)) {
                combos.add(newCombo)
            }
        }
    }

    return combos.combos
}

function getCombosRecursive(gearset: Gearset, gearIndex: number, comboSoFar: Combo, depth = 3): Combo[] {
    if (depth === 0) { return [comboSoFar] }

    const combos = new ComboSet()

    for (let i = gearIndex; i < gearset.gear.length; i++) {
        const gear = gearset.gear[i]

        const newCombo = {
            stats: { ...comboSoFar.stats },
            melds: comboSoFar.melds.slice(0),
        }

        for (const stat of Object.keys(gear.materiaStats)) {
            newCombo.stats[stat as keyof Stats] -= gear.materiaStats[stat as keyof Stats]
        }

        let meldSlots
        if (gear.advancedMelding) {
            meldSlots = 5
        } else if (gear.gearGroup === 'accessory') {
            meldSlots = 1
        } else {
            meldSlots = 2
        }

        for (const combo of getMeldCombos(gear, newCombo, meldSlots)) {
            for (const next of getCombosRecursive(gearset, i + 1, combo, depth - 1)) {
                combos.add(next)
            }
        }
    }

    return combos.combos
}

function getCombos(gearset: Gearset): Combo[] {
    return getCombosRecursive(gearset, 0, { stats: gearset.stats, melds: [] })
}

export async function solveMateria(gearset: Gearset, simulator: Simulator): Promise<Stats> {
    let best
    let bestDamage = (await simulator.calculateDamage(gearset.stats)).expected

    const combos = getCombos(gearset)

    console.log(combos.length)

    for (const combo of combos) {
        const damage = (await simulator.calculateDamage(combo.stats)).expected
        if (damage > bestDamage) {
            best = combo
            bestDamage = damage
        }
    }

    console.log(best, bestDamage)

    return best.stats
}
