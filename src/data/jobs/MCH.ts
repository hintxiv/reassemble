import { Attribute, JobInfo } from './job'
import { Machinist } from 'simulator/entity/player/jobs/machinist'

export const MCH_INFO: JobInfo = {
    name: "Machinist",
    playerCtor: Machinist,
    mainStat: Attribute.DEX,
    weaponDelay: 2.64,
    trait: 120,
    iconPath: '/jobicons/mch.svg',
    latest: {major: 5, minor: 4},
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
