import { DataProvider } from 'data/provider'
import { CastEvent, DamageEvent, EventType, FFLogsEvent } from 'parse/fflogs/event'
import { EventHandler } from 'simulator/handlers'

// Type - ID
export type EventKey = `${EventType}-${number}`

// TargetID - ActionID
export type CastKey = `${number}-${number}`

export abstract class Module {
    protected data = new DataProvider()
    protected handlers: Map<string, EventHandler<FFLogsEvent>> = new Map()
    public dependencies: Module[] = []

    protected abstract init(): void

    protected addDependency(dep: Module) {
        this.dependencies.push(dep)
    }

    protected getEventKey(event: FFLogsEvent): EventKey {
        const id = (event.type === 'cast' || event.type === 'damage')
            ? event.actionID : event.statusID

        return `${event.type}-${id}` as EventKey
    }

    protected getCastKey(event: CastEvent | DamageEvent): CastKey {
        // For multitarget casts, forgo the targetID distinction
        const action = this.data.findAction(event.actionID)
        const targetID = action.multihit ? '' : event.targetKey

        return `${targetID}-${event.actionID}` as CastKey
    }

    public processEvent(event: FFLogsEvent) {
        // Let dependencies go first
        this.dependencies.forEach(dep => dep.processEvent(event))

        const key = this.getEventKey(event)

        if (this.handlers.has(key)) {
            const handler = this.handlers.get(key)
            handler(event)
        }
    }

    /**
     * Adds an EventHandler to the entity. The generics say:
     *  "the handler must only consume events with the given type"
     *
     *   -> Only one handler per action / type combination is permitted!
     */
    protected addHandler<T extends EventType, E extends Extract<FFLogsEvent, { type: T }>>
    (type: T, id: number, handler: EventHandler<E>) {
        const key = `${type}-${id}`

        this.handlers.set(key, handler.bind(this))
    }
}
