"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementFactory = void 0;
const RequirementCommand_1 = require("../RequirementCommand");
class RequirementFactory {
    create({ id, value, title, description, dateToExecute, transactionTypeCode, executed, createdTimeStamp, updatedTimeStamp, }) {
        switch (transactionTypeCode) {
            case 0:
                return new RequirementCommand_1.IncrementMoneyRequirementCommand({
                    id,
                    value,
                    title,
                    description,
                    dateToExecute,
                    executed,
                    createdTimeStamp,
                    updatedTimeStamp,
                });
                break;
            case 1:
                return new RequirementCommand_1.DecrementMoneyRequirementCommand({
                    id,
                    value,
                    title,
                    description,
                    dateToExecute,
                    executed,
                    createdTimeStamp,
                    updatedTimeStamp,
                });
                break;
            default:
                return null;
                break;
        }
    }
    constructor() { }
}
exports.RequirementFactory = RequirementFactory;
