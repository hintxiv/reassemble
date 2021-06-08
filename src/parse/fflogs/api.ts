import ky, { Options } from 'ky'
import { Fight, Friend, PetFriend } from './fight'

const NO_FAKE_FRIENDS = [
    'Ground Effect',
    'Multiple Players',
    'Limit Break',
]

const options: Options = {
    prefixUrl: process.env.FFLOGS_API_URL,
    searchParams: {
        api_key: process.env.FFLOGS_API_KEY,
        translate: true,
    }, 
    timeout: 20000, // up to 20s for potentially large requests
}

const fflogs = ky.create(options)

interface ReportFight
{
    id: number
    start_time: number
    end_time: number
}

type ReportFriend = Friend & { fights: ReportFight[] }

type ReportPetFriend = PetFriend & { fights: ReportFight[] }

export interface FFLogsQuery
{
    start: number
    end: number
    sourceid?: number
    filter?: string
}

export async function fetchFight(reportID: string, fightID: number): Promise<Fight> {
    const report: any = await fflogs.get(`fights/${reportID}/`).json()
    const friends: Friend[] = []
    const friendlyPets: PetFriend[] = []

    report.friendlies.forEach((friend: ReportFriend) => {
        if (!NO_FAKE_FRIENDS.includes(friend.name)) {
            if (friend.fights.some(fight => fight.id === fightID )) {
                friends.push(friend)
            }
        }
    })

    report.friendlyPets.forEach((pet: ReportPetFriend) => {
        if (pet.fights.some(fight => fight.id === fightID)) {
            friendlyPets.push(pet)
        }
    })

    const reportFight: ReportFight = report.fights
        .filter((fight: ReportFight) => fight.id === fightID)[0]

    return {
        reportID: reportID,
        fightID: reportFight.id,
        start: reportFight.start_time,
        end: reportFight.end_time,
        friends: friends,
        pets: friendlyPets,
    }
}

export async function fetchLastFightID(reportID: string): Promise<number> {
    const report: any = await fflogs.get(`fights/${reportID}/`).json()

    return report.fights.slice(-1)[0].id
}

export async function fetchEvents(fight: Fight, query: FFLogsQuery): Promise<any> {
    const searchParams = query as Record<keyof FFLogsQuery, string | number> 

    const events = await fflogs.get(
        `events/summary/${fight.reportID}`,
        {searchParams: searchParams}    
    )

    return events.json()
}
