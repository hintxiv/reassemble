import { Attribute } from 'functions/modifiers/job'
import { Ninja } from 'simulator/entity/player/jobs/ninja'
import { JobInfo } from './job'

export const NIN_INFO: JobInfo = {
    job: 'Ninja',
    role: 'Melee',
    playerCtor: Ninja,
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
    weaponDelay: 2.56,
    trait: 100,
    iconPath: '/jobicons/nin.svg',
    latest: {major: 6, minor: 1},
    bis: 'ff32cb2c-8faa-4b69-9c66-73bd02cc13dd',
    damageMap: {
        Ability: Attribute.DEX,
        Auto: Attribute.DEX,
        DoT: Attribute.DEX,
        Spell: Attribute.DEX,
        Weaponskill: Attribute.DEX,
    },
}
