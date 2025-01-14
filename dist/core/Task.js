"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementTask = void 0;
class RequirementTask {
    getRequirement() {
        return this.requirement;
    }
    getDateStart() {
        return this.dateStart;
    }
    constructor(dateStart, requirement) {
        this.dateStart = dateStart;
        this.requirement = requirement;
    }
}
exports.RequirementTask = RequirementTask;
