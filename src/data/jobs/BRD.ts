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
    latest: {major: 5, minor: 5},
    bis: '8418d22e-d70e-4b1a-87e0-d2b79dc3bd91',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
