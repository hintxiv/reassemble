import { Attribute } from './job'

type PetModifiers = {
    [key in Attribute]?: number
} & {
    trait?: number
}

export const PET_MODS: Record<string, PetModifiers> = {
    ['Automaton Queen']: {
        [Attribute.DEX]: 100,
    },
    ['Bunshin']: {
        [Attribute.DEX]: 100,
    },
}
