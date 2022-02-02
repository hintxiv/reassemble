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
    latest: {major: 6, minor: 0},
    bis: '803a3d1c-e1b9-468a-973d-32e2cdfe11d7',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
