export interface IAppEvent {
    execute(): void
}

export class AppEvent implements IAppEvent {
    execute(): void {}

    constructor() {}
}

export interface IEventService {
    addEvent(event: IAppEvent): void
}

export class EventService implements IEventService {
    eventsPool: IAppEvent[]

    addEvent(event: IAppEvent): void {
        this.eventsPool.push(event)
    }

    observe() {
        this.eventsPool.forEach((event) => {
            // event
        })
    }

    constructor() {
        this.eventsPool = []
    }
}
