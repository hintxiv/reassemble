import { Attribute } from 'functions/modifiers/job'
import { Dancer } from 'simulator/entity/player/jobs/dancer'
import { JobInfo } from './job'

export const DNC_INFO: JobInfo = {
    job: 'Dancer',
    role: 'Ranged',
    playerCtor: Dancer,
    mainStat: Attribute.DEX,
    stats: [
        'weaponDamage',
        'vitality',
        'dexterity',
        'critical',
        'determination',
        'direct',
        'skillspeed',
    ],
    weaponDelay: 3.12,
    trait: 120,
    iconPath: '/jobicons/dnc.svg',
    latest: {major: 6, minor: 2},
    bis: 'a3d405b8-3bd9-41b1-b039-7a71c4c9f6d2',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
