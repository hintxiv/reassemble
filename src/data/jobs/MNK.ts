import { Attribute } from 'functions/modifiers/job'
import { Monk } from 'simulator/entity/player/jobs/monk'
import { JobInfo } from './job'

export const MNK_INFO: JobInfo = {
    job: 'Monk',
    role: 'Melee',
    playerCtor: Monk,
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
    weaponDelay: 2.56,
    trait: 100,
    iconPath: '/jobicons/mnk.svg',
    latest: {major: 6, minor: 3},
    bis: '3ab677f7-9934-4578-aa3f-553344d35421',
    damageMap: {
        Ability: Attribute.STR,
        Auto: Attribute.STR,
        DoT: Attribute.STR,
        Spell: Attribute.STR,
        Weaponskill: Attribute.STR,
    },
}
