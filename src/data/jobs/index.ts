import { BRD_INFO } from './BRD'
import { DNC_INFO } from './DNC'
import { MCH_INFO } from './MCH'
import { Attribute, Job, JobInfo } from './job'

export { Attribute, Job, JobInfo }

export const JOBS: Record<Job, JobInfo> = {
    Bard: BRD_INFO,
    Dancer: DNC_INFO,
    Machinist: MCH_INFO,
}
