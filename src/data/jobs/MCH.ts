import { Attribute } from 'functions/modifiers/job'
import { Machinist } from 'simulator/entity/player/jobs/machinist'
import { JobInfo } from './job'

export const MCH_INFO: JobInfo = {
    job: 'Machinist',
    role: 'Ranged',
    playerCtor: Machinist,
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
    weaponDelay: 2.64,
    trait: 120,
    iconPath: '/jobicons/mch.svg',
    latest: {major: 7, minor: 0},
    bis: 'd0993d6e-4816-4905-9ba6-6a206c073314',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
