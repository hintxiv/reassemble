import { Attribute } from 'functions/modifiers/job'
import { Samurai } from 'simulator/entity/player/jobs/samurai'
import { JobInfo } from './job'

export const SAM_INFO: JobInfo = {
    job: 'Samurai',
    role: 'Melee',
    playerCtor: Samurai,
    mainStat: Attribute.STR,
    stats: [
        'weaponDamage',
        'vitality',
        'strength',
        'critical',
        'determination',
        'direct',
        'skillspeed',
    ],
    weaponDelay: 2.64,
    trait: 100,
    iconPath: '/jobicons/sam.svg',
    latest: {major: 7, minor: 0},
    bis: '9d391b8e-a734-4f06-b600-2eff580f0aae',
    damageMap: {
        Ability: Attribute.STR,
        Auto: Attribute.STR,
        DoT: Attribute.STR,
        Spell: Attribute.STR,
        Weaponskill: Attribute.STR,
    },
}
