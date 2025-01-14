"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonObserver = void 0;
class PersonObserver {
    addObserveable(cb) {
        this.observeables.push({ executed: false, subject: cb });
    }
    execute(user) {
        this.observeables.forEach((elem) => {
            if (!elem.executed) {
                elem.subject(user);
                elem.executed = true;
            }
        });
    }
    constructor() {
        this.observeables = [];
    }
}
exports.PersonObserver = PersonObserver;
