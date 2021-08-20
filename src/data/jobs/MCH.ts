import { Machinist } from 'simulator/entity/player/jobs/machinist'
import { Attribute, JobInfo } from './job'

export const MCH_INFO: JobInfo = {
    name: 'Machinist',
    playerCtor: Machinist,
    mainStat: Attribute.DEX,
    weaponDelay: 2.64,
    trait: 120,
    iconPath: '/jobicons/mch.svg',
    latest: {major: 5, minor: 5},
    bis: 'bec1645b-a739-4dfd-8efa-aedfb852774e',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
