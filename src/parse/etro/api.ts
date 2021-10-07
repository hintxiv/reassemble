import ky, { Options } from 'ky'
import { Stats, makeStats } from 'simulator/gear/stats'

const statIDs: Record<number, keyof Stats> = {
    [12]: 'weaponDamage',
    [-1]: 'strength', // TODO
    [2]: 'dexterity',
    [3]: 'vitality',
    [-2]: 'intelligence', // TODO
    [-3]: 'mind', // TODO
    [22]: 'direct',
    [27]: 'critical',
    [44]: 'determination',
    [45]: 'skillspeed',
    [-4]: 'spellspeed', // TODO
    [-5]: 'tenacity', // TODO
}

const options: Options = {
    prefixUrl: process.env.ETRO_API_URL,
}

const etro = ky.create(options)

interface EtroResponseGearset
{
    name: string
    totalParams: Array<{ id: number, name: string, value: number }>
    // ... some other stuff too, but we only care about these fields
}

async function getGearset(id: string): Promise<EtroResponseGearset> {
    const response = await etro.get(`gearsets/${id}/`)

    return response.json()
}

export async function getStats(id: string): Promise<{name: string, stats: Stats}> {
    const gearset = await getGearset(id)
    const name = gearset.name
    const stats = makeStats()

    gearset.totalParams.forEach(p => {
        if (p.id in statIDs) {
            stats[statIDs[p.id]] = p.value
        }
    })

    return { name, stats }
}
