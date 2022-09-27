import { CastEvent } from 'api/fflogs/event'
import { NIN_INFO } from 'data/jobs/NIN'
import { NIN } from 'data/packs'
import { Buff } from 'simulator/buff'
import { Player } from '../player'

const TRICK_ATTACK: Buff = {
    statusID: NIN.DEBUFFS.TRICK_ATTACK.id,
    potency: 1.1,
}

const KASSATSU: Buff = {
    statusID: NIN.STATUSES.KASSATSU.id,
    potency: 1.3,
}

const NINJUTSU_ACTIONS = [
    NIN.ACTIONS.FUMA_SHURIKEN.id,
    NIN.ACTIONS.KATON.id,
    NIN.ACTIONS.RAITON.id,
    NIN.ACTIONS.HYOTON.id,
    //NIN.ACTIONS.DOTON.id,
    NIN.ACTIONS.SUITON.id,
    NIN.ACTIONS.GOKA_MEKKYAKU.id,
    NIN.ACTIONS.HYOSHO_RANRYU.id,
]

const PET_ACTIONS = [
    NIN.ACTIONS.PHANTOM_KAMAITACHI.id,
    NIN.ACTIONS.SPINNING_EDGE_BUNSHIN.id,
    NIN.ACTIONS.GUST_SLASH_BUNSHIN.id,
    NIN.ACTIONS.THROWING_DAGGER_BUNSHIN.id,
    NIN.ACTIONS.AEOLIAN_EDGE_BUNSHIN.id,
    NIN.ACTIONS.DEATH_BLOSSOM_BUNSHIN.id,
    NIN.ACTIONS.HAKKE_MUJINSATSU_BUNSHIN.id,
    NIN.ACTIONS.HURAIJIN_BUNSHIN.id,
    NIN.ACTIONS.FORKED_RAIJU_BUNSHIN.id,
    NIN.ACTIONS.FLEETING_RAIJU_BUNSHIN.id,
]

export class Ninja extends Player {
    jobInfo = NIN_INFO
    debuffs = [TRICK_ATTACK]

    protected init() {
        super.init()

        Object.values(NIN.ACTIONS).forEach(action => {
            if (NINJUTSU_ACTIONS.includes(action.id)) {
                this.addHandler('cast', action.id, this.onNinjutsuCast)
            } else if (action.id === NIN.ACTIONS.BHAVACAKRA.id) {
                this.addHandler('cast', action.id, this.onBhavacakraCast)
            } else if (PET_ACTIONS.includes(action.id)) {
                this.addHandler('cast', action.id, this.onPetCast)
            } else {
                this.addHandler('cast', action.id, this.onCast)
            }

            this.addHandler('damage', action.id, this.onDamage)
        })
    }

    private onNinjutsuCast(event: CastEvent) {
        const buffs = this.activeBuffs

        if (this.hasStatus(KASSATSU.statusID)) {
            buffs.push(KASSATSU)
        }

        this.addCast(event, buffs)
    }

    private onBhavacakraCast(event: CastEvent) {
        let addedPotency = 0

        if (this.hasStatus(NIN.STATUSES.MEISUI.id)) {
            addedPotency = 150
        }

        this.addCast(event, this.activeBuffs, { addedPotency: addedPotency })
    }

    private onPetCast(event: CastEvent) {
        this.addCast(event, this.activeBuffs, { pet: 'Bunshin' })
    }
}
