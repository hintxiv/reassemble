import { BRD_INFO } from './BRD'
import { DNC_INFO } from './DNC'
import { Job, JobInfo } from './job'
import { MCH_INFO } from './MCH'

export { Job, JobInfo }

export const JOBS: Record<Job, JobInfo> = {
    Bard: BRD_INFO,
    Dancer: DNC_INFO,
    Machinist: MCH_INFO,
}
