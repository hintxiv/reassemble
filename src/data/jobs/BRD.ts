import { Attribute } from 'functions/modifiers/job'
import { Bard } from 'simulator/entity/player/jobs/bard'
import { JobInfo } from './job'

export const BRD_INFO: JobInfo = {
    job: 'Bard',
    role: 'Ranged',
    playerCtor: Bard,
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
    weaponDelay: 3.04,
    trait: 120,
    iconPath: '/jobicons/brd.svg',
    latest: {major: 6, minor: 0},
    bis: 'dfef14f7-7a4d-4cde-bdba-a8cee50345e8',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
