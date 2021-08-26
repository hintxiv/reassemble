import { Job } from 'data/jobs'

export const enum Attribute {
    HP, MP, STR, VIT, DEX, INT, MND
}

type JobModifiers = { [key in Attribute]: number }

export const JOB_MODS: Record<Job, JobModifiers> = {
    Bard: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 79,
        [Attribute.STR]: 90,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 85,
        [Attribute.MND]: 80,
    },
    Dancer: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 79,
        [Attribute.STR]: 90,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 85,
        [Attribute.MND]: 80,
    },
    Machinist: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 79,
        [Attribute.STR]: 85,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 80,
        [Attribute.MND]: 85,
    },
}
