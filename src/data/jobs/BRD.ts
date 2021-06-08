import { Attribute, JobInfo } from './job'
import { Bard } from 'simulator/entity/player/jobs/bard'

export const BRD_INFO: JobInfo = {
    name: "Bard",
    playerCtor: Bard,
    mainStat: Attribute.DEX,
    weaponDelay: 3.04,
    trait: 120,
    iconPath: '/jobicons/brd.svg',
    latest: {major: 5, minor: 4},
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
