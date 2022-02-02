import * as ALL_DATA from './ALL'
import * as BRD_DATA from './BRD'
import * as DNC_DATA from './DNC'
import * as MCH_DATA from './MCH'
import * as RAIDBUFF_DATA from './RAIDBUFFS'
import * as RPR_DATA from './RPR'

const STATUS_OFFSET = 1000000

/**
 * Offsets the status IDs to play nice with FFLogs
 */
function offsetID<T extends {id: number}, S extends Record<string, T>>(statuses: S) {
    Object.values(statuses).forEach(status => {
        status.id += STATUS_OFFSET
    })
    return statuses
}

export const ALL = {
    ACTIONS: ALL_DATA.ACTIONS,
    STATUSES: offsetID(ALL_DATA.STATUSES),
}

export const BRD = {
    ACTIONS: BRD_DATA.ACTIONS,
    STATUSES: offsetID(BRD_DATA.STATUSES),
    DEBUFFS: offsetID(BRD_DATA.DEBUFFS),
}

export const DNC = {
    ACTIONS: DNC_DATA.ACTIONS,
    STATUSES: offsetID(DNC_DATA.STATUSES),
}

export const MCH = {
    ACTIONS: MCH_DATA.ACTIONS,
    STATUSES: offsetID(MCH_DATA.STATUSES),
    DEBUFFS: offsetID(MCH_DATA.DEBUFFS),
}

export const RPR = {
    ACTIONS: RPR_DATA.ACTIONS,
    STATUSES: offsetID(RPR_DATA.STATUSES),
    DEBUFFS: offsetID(RPR_DATA.DEBUFFS),
}

export const RAIDBUFFS = {
    STATUSES: offsetID(RAIDBUFF_DATA.STATUSES),
    DEBUFFS: offsetID(RAIDBUFF_DATA.DEBUFFS),
}
