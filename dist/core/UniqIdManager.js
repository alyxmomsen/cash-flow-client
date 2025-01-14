"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqIdManager = void 0;
const Registry_1 = require("./Registry");
class UniqIdManager {
    gen() {
        // this.registry.isExist()
        return 0;
    }
    constructor() {
        this.registry = new Registry_1.IdRegistry();
    }
}
exports.UniqIdManager = UniqIdManager;
