import  {preserve } from 'utilities/types'

export interface LevelModifier
{
    MP: number,
    MAIN: number,
    SUB: number,
    DIV: number,
    HP: number,
}

export const LEVEL_MODS = preserve<LevelModifier>()({
    // TODO
    80: {
        MP: 10000,
        MAIN: 340,
        SUB: 380,
        DIV: 1900,
        HP: 4400,
    },
    90: {
        MP: 10000,
        MAIN: 390,
        SUB: 400,
        DIV: 1900,
        HP: 4400,
    },
})

export type Level = keyof typeof LEVEL_MODS
