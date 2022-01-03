import { Attribute } from 'functions/modifiers/job'
import { Reaper } from 'simulator/entity/player/jobs/reaper'
import { JobInfo } from './job'

export const RPR_INFO: JobInfo = {
    job: 'Reaper',
    role: 'Melee',
    playerCtor: Reaper,
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
    weaponDelay: 3.20,
    trait: 100,
    iconPath: '/jobicons/rpr.svg',
    latest: {major: 6, minor: 0},
    bis: '89227288-0573-487d-8ccb-1e87fc972efe',
    damageMap: {
        Ability: Attribute.STR,
        Auto: Attribute.STR,
        DoT: Attribute.STR,
        Spell: Attribute.STR,
        Weaponskill: Attribute.STR,
    },
}
