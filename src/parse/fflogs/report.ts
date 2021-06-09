import { Friend, PetFriend } from './fight'

export interface ReportFight
{
    id: number
    start_time: number
    end_time: number
}

export type ReportFriend = Friend & { fights: ReportFight[] }
export type ReportPetFriend = PetFriend & { fights: ReportFight[] }

export interface Report
{
    friendlies: ReportFriend[]
    friendlyPets: ReportPetFriend[]
    fights: ReportFight[]
}
