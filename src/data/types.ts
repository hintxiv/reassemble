export type ActionType =
    | 'Ability'
    | 'Auto'
    | 'Spell'
    | 'Weaponskill'

interface ComboInfo
{
    from: number
    duration: number
    potency: number
}

export interface Action
{
    id: number
    type: ActionType
    potency?: number

    combo?: ComboInfo
    startsCombo?: boolean
    breaksCombo?: boolean

    multihit?: boolean
    falloff?: number
}

export interface Status
{
    id: number
    stacks?: boolean
}

export interface Debuff extends Status
{
    potency?: number
    castActions: number[]
}
