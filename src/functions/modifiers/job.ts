import { Job } from 'data/jobs'

export const enum Attribute {
    HP, MP, STR, VIT, DEX, INT, MND
}

type JobModifiers = { [key in Attribute]: number }

export const JOB_MODS: Record<Job, JobModifiers> = {
    Bard: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 100,
        [Attribute.STR]: 90,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 85,
        [Attribute.MND]: 80,
    },
    Dancer: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 100,
        [Attribute.STR]: 90,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 85,
        [Attribute.MND]: 80,
    },
    Machinist: {
        [Attribute.HP]: 105,
        [Attribute.MP]: 100,
        [Attribute.STR]: 85,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 115,
        [Attribute.INT]: 80,
        [Attribute.MND]: 85,
    },
    Monk: {
        [Attribute.HP]: 110,
        [Attribute.MP]: 100,
        [Attribute.STR]: 110,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 105,
        [Attribute.INT]: 50,
        [Attribute.MND]: 90,
    },
    Ninja: {
        [Attribute.HP]: 108,
        [Attribute.MP]: 100,
        [Attribute.STR]: 85,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 110,
        [Attribute.INT]: 65,
        [Attribute.MND]: 85,
    },
    Reaper: {
        [Attribute.HP]: 115,
        [Attribute.MP]: 100,
        [Attribute.STR]: 115,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 100,
        [Attribute.INT]: 80,
        [Attribute.MND]: 40,
    },
    // 'Red Mage': {
    //     [Attribute.HP]: 105,
    //     [Attribute.MP]: 100,
    //     [Attribute.STR]: 55,
    //     [Attribute.VIT]: 100,
    //     [Attribute.DEX]: 105,
    //     [Attribute.INT]: 115,
    //     [Attribute.MND]: 110,
    // },
    Samurai: {
        [Attribute.HP]: 109,
        [Attribute.MP]: 100,
        [Attribute.STR]: 112,
        [Attribute.VIT]: 100,
        [Attribute.DEX]: 108,
        [Attribute.INT]: 60,
        [Attribute.MND]: 50,
    },
}
