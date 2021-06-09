import { Dancer } from 'simulator/entity/player/jobs/dancer'
import { Attribute, JobInfo } from './job'

export const DNC_INFO: JobInfo = {
    name: 'Dancer',
    playerCtor: Dancer,
    mainStat: Attribute.DEX,
    weaponDelay: 3.12,
    trait: 120,
    iconPath: '/jobicons/dnc.svg',
    latest: {major: 5, minor: 5},
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
