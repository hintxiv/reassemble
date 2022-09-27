import { FFLogsEvent } from 'api/fflogs/event'
import { CastInstance, DamageInstance } from 'simulator/damage'

export type EventHandler<E extends FFLogsEvent> = (event: E) => void
export type CastHandler = (cast: CastInstance) => void
export type DamageHandler = (damage: DamageInstance) => void
