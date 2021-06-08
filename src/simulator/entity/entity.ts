import { DataProvider } from "data/provider"
import { Status } from "data/types"
import { 
    ApplyBuffEvent, 
    ApplyDebuffEvent, 
    CastEvent, 
    DamageEvent, 
    EventType, 
    FFLogsEvent, 
    RemoveBuffEvent, 
    RemoveDebuffEvent
} from "parse/fflogs/event"
import { EventHandler } from "simulator/handlers"

export type EventKey = `${EventType}-${number}`  // Type - ID
export type CastKey = `${number}-${number}`  // TargetID - ActionID

/**
 * Represents an Entity in the report
 * @param id - FFLogs actor ID
 */
export abstract class Entity
{
    public key: string

    protected data = new DataProvider()
    protected activeStatuses: Set<Status['id']> = new Set()
    protected handlers: Map<string, EventHandler<FFLogsEvent>> = new Map()

    constructor(key: string) {
        this.key = key
    }

    public processEvent(event: FFLogsEvent) {
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
    protected addHandler< T extends EventType, E extends Extract<FFLogsEvent, {type: T}> > 
     (type: T, id: number, handler: EventHandler<E>) {
         const key = `${type}-${id}`
 
         this.handlers.set(key, handler.bind(this))
    }

    protected hasStatus(statusID: number) {
        return this.activeStatuses.has(statusID)
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

    /**
     * Common event handlers below
     */
    protected onApplyStatus(event: ApplyBuffEvent | ApplyDebuffEvent) {
        this.activeStatuses.add(event.statusID)
    }

    protected onRemoveStatus(event: RemoveBuffEvent | RemoveDebuffEvent) {
        this.activeStatuses.delete(event.statusID)
    }
}
