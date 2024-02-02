import { BRD_INFO } from './BRD'
import { DNC_INFO } from './DNC'
import { Job, JobInfo } from './job'
import { MCH_INFO } from './MCH'
import { MNK_INFO } from './MNK'
import { NIN_INFO } from './NIN'
import { RPR_INFO } from './RPR'
import { SAM_INFO } from './SAM'

export { Job, JobInfo }

export const JOBS: Record<Job, JobInfo> = {
    Bard: BRD_INFO,
    Dancer: DNC_INFO,
    Machinist: MCH_INFO,
    Monk: MNK_INFO,
    Ninja: NIN_INFO,
    Reaper: RPR_INFO,
    Samurai: SAM_INFO,
}
