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
    latest: {major: 6, minor: 28},
    bis: '6b4b1ba5-a821-41a0-b070-b1f50e986f85',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
