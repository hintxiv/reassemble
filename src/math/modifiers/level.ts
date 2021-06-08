import { preserve } from 'utilities/types'

export interface LevelModifier
{
    MP: number,
    MAIN: number,
    SUB: number,
    DIV: number,
    HP: number,
}

export const LEVEL_MODS = preserve<LevelModifier>()({
    80: {
        MP: 10000,
        MAIN: 340,
        SUB: 380,
        DIV: 3300,
        HP: 4400,
    },
})

export type Level = keyof typeof LEVEL_MODS
