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
    latest: {major: 6, minor: 0},
    bis: '89227288-0573-487d-8ccb-1e87fc972efe',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
