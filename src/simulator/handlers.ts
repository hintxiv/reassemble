import { CastInstance, DamageInstance } from "simulator/damage"
import { FFLogsEvent } from "parse/fflogs/event"

export type EventHandler<E extends FFLogsEvent> = (event: E) => void
export type CastHandler = (cast: CastInstance) => void
export type DamageHandler = (damage: DamageInstance) => void