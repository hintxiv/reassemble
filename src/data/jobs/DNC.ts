import { Attribute } from 'math/modifiers/job'
import { Dancer } from 'simulator/entity/player/jobs/dancer'
import { JobInfo } from './job'

export const DNC_INFO: JobInfo = {
    name: 'Dancer',
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
    latest: {major: 5, minor: 5},
    bis: 'e4cd5da5-6365-4e30-bd26-8e5fadf8a17f',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
