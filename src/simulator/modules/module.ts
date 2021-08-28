import { DataProvider } from 'data/provider'
import { EventType, FFLogsEvent } from 'parse/fflogs/event'
import { EventHandler } from 'simulator/handlers'

// Type - ID
export type EventKey = `${EventType}-${number}`

export abstract class Module {
    protected data = new DataProvider()
    protected handlers: Map<string, EventHandler<FFLogsEvent>> = new Map()
    protected dependencies: Module[]

    constructor(deps?: Module[]) {
        this.dependencies = deps ?? []
    }

    protected getEventKey(event: FFLogsEvent): EventKey {
        const id = (event.type === 'cast' || event.type === 'damage')
            ? event.actionID : event.statusID

        return `${event.type}-${id}` as EventKey
    }

    public processEvent(event: FFLogsEvent) {
        // Run dependency modules first
        this.dependencies.forEach(d => d.processEvent(event))

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
