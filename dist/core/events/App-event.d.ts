export interface IAppEvent {
    execute(): void;
}
export declare class AppEvent implements IAppEvent {
    execute(): void;
    constructor();
}
export interface IEventService {
    addEvent(event: IAppEvent): void;
}
export declare class EventService implements IEventService {
    eventsPool: IAppEvent[];
    addEvent(event: IAppEvent): void;
    observe(): void;
    constructor();
}
