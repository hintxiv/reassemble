import { Stats } from 'simulator/gear/stats'

export interface Materia
{
    id: number
    name: string
    stat: keyof Stats
    amount: number
}
