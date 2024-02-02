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
    latest: {major: 6, minor: 4},
    bis: 'd4b6bfc6-a82f-4732-8e55-7c13e094fc1d',
    damageMap: {
        Ability: Attribute.STR,
        Auto: Attribute.STR,
        DoT: Attribute.STR,
        Spell: Attribute.STR,
        Weaponskill: Attribute.STR,
    },
}
