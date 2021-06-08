import { Job } from 'data/jobs'

export interface Friend
{
    id: number
    name: string
    type: Job
}

export interface PetFriend
{
    id: number
    name: string
    petOwner: number
}

export interface Fight
{
    reportID: string
    fightID: number
    start: number
    end: number
    friends: Friend[]
    pets: PetFriend[]
}
