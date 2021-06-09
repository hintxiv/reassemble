import { BRD_INFO } from './BRD'
import { DNC_INFO } from './DNC'
import { Attribute, Job, JobInfo } from './job'
import { MCH_INFO } from './MCH'

export { Attribute, Job, JobInfo }

export const JOBS: Record<Job, JobInfo> = {
    Bard: BRD_INFO,
    Dancer: DNC_INFO,
    Machinist: MCH_INFO,
}
