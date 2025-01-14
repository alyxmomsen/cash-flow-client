"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = exports.AppEvent = void 0;
class AppEvent {
    execute() { }
    constructor() { }
}
exports.AppEvent = AppEvent;
class EventService {
    addEvent(event) {
        this.eventsPool.push(event);
    }
    observe() {
        this.eventsPool.forEach((event) => {
            // event
        });
    }
    constructor() {
        this.eventsPool = [];
    }
}
exports.EventService = EventService;
