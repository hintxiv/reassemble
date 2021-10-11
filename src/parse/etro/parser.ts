import { ENCOUNTERS } from 'data/encounters'
import { MATERIA } from 'data/materia'
import { Gear, gearMap } from 'simulator/gear/gear'
import { makeStats, statMap, Stats } from 'simulator/gear/stats'
import { equipmentKeys, EtroResponseGearset, fetchEquipment, fetchGearset, fetchRelic, statIDs }  from './api'

const paramKeys = [
    'param0', 'param1', 'param2', 'param3', 'param4', 'param5',
] as const

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
type ValueKey = `param${0 | 1 | 2 | 3 | 4 | 5}Value`
type DamageKey = `damage${'Phys' | 'Mag'}`

function getMateriaStats(materiaList: Record<string, number>) {
    const materiaStats: Partial<Stats> = {}

    for (const materiaID of Object.values(materiaList)) {
        if (materiaID in MATERIA) {
            const materia = MATERIA[materiaID]
            if (materia.stat in materiaStats) {
                materiaStats[materia.stat] += materia.amount
            } else {
                materiaStats[materia.stat] = materia.amount
            }
        }
    }

    return materiaStats
}

async function getGear(gearset: EtroResponseGearset, weaponDamageType: DamageKey): Promise<Gear[]> {
    const gear: Gear[] = []

    for (const key of equipmentKeys) {
        const equipID = gearset[key]
        if (!equipID) { continue }

        const equip = await fetchEquipment(equipID)
        const equipStats: Partial<Stats> = {}

        for (const p of paramKeys) {
            if (p in equip && equip[p] !== null) {
                const stat = statIDs[equip[p]]
                const vKey = `${p}Value` as ValueKey
                const value = equip[vKey]
                equipStats[stat] = value
            }
        }

        let materiaStats = {}
        if (equipID in gearset.materia) {
            // Include materia stats if this piece isn't synced
            const materiaList = gearset.materia[equipID]
            materiaStats = getMateriaStats(materiaList)
        }

        // Get weapon damage
        if (weaponDamageType in equip) {
            equipStats.weaponDamage = equip[weaponDamageType]
        }

        gear.push({
            name: equip.name,
            gearGroup: gearMap[key],
            itemLevel: equip.itemLevel,
            stats: equipStats,
            materiaStats: materiaStats,
        })
    }

    return gear
}

async function getRelic(relicID: string, weaponDamageType: DamageKey): Promise<Gear> {
    const relic = await fetchRelic(relicID)
    const base = relic.baseItem
    const relicStats: Partial<Stats> = {}

    for (const p of paramKeys) {
        if (p in relic && relic[p] !== null) {
            const stat = statIDs[relic[p]]
            const vKey = `${p}Value` as ValueKey
            const value = relic[vKey]
            relicStats[stat] = value
        }

        if (p in base && base[p] !== null) {
            const stat = statIDs[base[p]]
            const vKey = `${p}Value` as ValueKey
            const value = base[vKey]
            relicStats[stat] = value
        }
    }

    // Get weapon damage
    if (weaponDamageType in base) {
        relicStats.weaponDamage = base[weaponDamageType]
    }

    return {
        name: relic.name,
        gearGroup: 'weapon',
        itemLevel: base.itemLevel,
        stats: relicStats,
    }
}

export async function getStats(id: string, zoneID: number) {
    const gearset = await fetchGearset(id)
    const name = gearset.name
    const stats = makeStats()

    if (!(zoneID in ENCOUNTERS)) {
        // Not a known encounter, assume there's no stat sync
        gearset.totalParams.forEach(p => {
            if (p.id in statIDs) {
                stats[statIDs[p.id]] = p.value
            }
        })

        return { name, stats }
    }

    const enc = ENCOUNTERS[zoneID]

    let statCaps
    let weaponDamageType: DamageKey

    // TODO other roles
    if (['BRD', 'MCH', 'DNC'].includes(gearset.jobAbbrev)) {
        statCaps = enc.rangedStatCaps
        weaponDamageType = 'damagePhys'
    }

    const gear = await getGear(gearset, weaponDamageType)

    if (gearset.relics.weapon) {
        const relic = await getRelic(gearset.relics.weapon, weaponDamageType)
        gear.push(relic)
    }

    for (const g of gear) {
        if (g.itemLevel > enc.ilvlSync) {
            const caps = statCaps[g.gearGroup]
            Object.keys(g.stats).forEach((stat: keyof Stats) => {
                stats[stat] += Math.min(g.stats[stat], caps[statMap[stat]])
            })

        } else {
            Object.keys(g.stats).forEach((stat: keyof Stats) => {
                stats[stat] += g.stats[stat]
            })

            // Gear isn't synced, so include materia
            Object.keys(g.materiaStats).forEach((stat: keyof Stats) => {
                stats[stat] += g.materiaStats[stat]
            })
        }
    }

    return { name, stats }
}
