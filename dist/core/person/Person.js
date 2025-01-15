"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdinaryPerson = exports.Person = void 0;
exports.getDateUtil = getDateUtil;
const Wallet_1 = require("../Wallet");
const PersonStatus_1 = require("./PersonStatus");
const person_observer_1 = require("./observers/person-observer");
class Person {
    getCreatedTimeStamp() {
        return this.createdTimeStamp;
    }
    getUpdatedTimeStamp() {
        return this.updatedTimeStamp;
    }
    getStats() {
        const userStats = {
            createdTimeStamp: this.getCreatedTimeStamp(),
            name: this.getName(),
            requirements: this.getAllReauirementCommands().map((elem) => {
                return {
                    transactionTypeCode: elem.getTransactionTypeCode(),
                    createdTimeStamp: elem.getCreatedTimeStamp(),
                    dateToExecute: elem.getDateToExecute(),
                    description: elem.getDescription(),
                    executed: elem.isExecuted(),
                    id: elem.getId(),
                    title: elem.getTitle(),
                    updatedTimeStamp: elem.getUpdatedTimeStamp(),
                    value: elem.getValue(),
                };
            }),
            updatedTimeStamp: this.getUpdatedTimeStamp(),
            wallet: this.getWalletBalance(),
        };
        return userStats;
    }
    removeTransactionsToSyncAsStats() {
        console.log(">>> remove requirements ::: started");
        const requirementsStatsArr = Array.from(this.requirementToSyncPool.entries())
            .filter((elem) => {
            const [, poolElem] = elem;
            if (poolElem.removed)
                return false;
            return true;
        })
            .map((elem) => {
            const [, poolElement] = elem;
            console.log(">>> remove requirement ::: ", poolElement);
            console.log(">>> remove requirement :::: 2", poolElement.data.getTransactionTypeCode());
            poolElement.removed = true;
            const requirement = poolElement.data;
            return {
                createdTimeStamp: requirement.getCreatedTimeStamp(),
                transactionTypeCode: requirement.getTransactionTypeCode(),
                updatedTimeStamp: requirement.getUpdatedTimeStamp(),
                dateToExecute: requirement.getDateToExecute(),
                deleted: requirement.getDeletedTheState(),
                description: requirement.getDescription(),
                id: requirement.getId(),
                executed: requirement.isExecuted(),
                title: requirement.getTitle(),
                value: requirement.getValue(),
            };
        });
        return requirementsStatsArr;
    }
    on(message, callBacks) {
        this.subscribers.push({
            callBacksPool: callBacks,
            executedTimeStamp: 0,
            message,
        });
    }
    onUpdate(cb) {
        this.onUpdateObserver.addObserveable(cb);
    }
    getRequirementCommandById(id) {
        const requirements = this.requirementCommandsPool.filter((elem) => {
            return elem.getId() === id;
        });
        return requirements;
    }
    getStatusDescription() {
        return this.status.getDescription();
    }
    setStatus(status) {
        this.status = status;
        return true;
    }
    getWalletTrackForActualRequirements() {
        let balance = this.wallet.getBalance();
        return this.getActualRequirementCommands().map((requirement) => {
            const value = requirement.getValue();
            const valueBefore = balance;
            const valueAfter = requirement.executeWithValue(balance);
            balance = valueAfter;
            return {
                value,
                valueBefore,
                valueAfter,
                executionDate: requirement.getDateToExecute(),
                transactionTypeCode: requirement.getTransactionTypeCode(),
            };
        });
    }
    getName() {
        return this.name;
    }
    incrementWallet(value) {
        this.wallet.add(value);
    }
    decrementWallet(value) {
        this.wallet.remove(value);
    }
    addRequirementCommand(requirementCommand) {
        requirementCommand.subscribeOnUpdate((reqId) => {
            console.log(">>> add requirement id test :: id : " + reqId);
            this.requirementToSyncPool.set(reqId, {
                removed: false,
                data: requirementCommand,
            });
            this.emitMessage("requirement-updated");
            console.log(">>> add requirement :: requirement updated");
        });
        this.requirementCommandsPool.push(requirementCommand);
        return requirementCommand;
    }
    getWalletBalance() {
        return this.wallet.getBalance();
    }
    getActualRequirementCommands() {
        return this.requirementCommandsPool.filter((requirementCommand) => {
            if (requirementCommand.isExecuted()) {
                return false;
            }
            const now = Date.now();
            // const requirementDateObj = getDateUtil(
            //     new Date(requirementCommand.getExecutionTimestamp())
            // )
            if (requirementCommand.getDateToExecute() >= now) {
                return true;
            }
            return false;
        });
    }
    getAllReauirementCommands() {
        return this.requirementCommandsPool;
    }
    getExecutedRequirementCommands() {
        return this.requirementCommandsPool.filter((elem) => {
            return !elem.isExecuted();
        });
    }
    emitMessage(message) {
        this.subscribers.forEach((elem) => {
            if (elem.message === message) {
                elem.callBacksPool.forEach((callBack) => {
                    callBack();
                });
            }
        });
    }
    constructor({ wallet, name, updatedTimeStamp, createdTimeStamp, }) {
        this.onUpdateObserver = new person_observer_1.PersonObserver();
        this.wallet = wallet;
        this.name = name;
        this.requirementCommandsPool = [];
        this.averageSpending = 700;
        this.status = new PersonStatus_1.GoingSleepStatus();
        this.subscribers = [];
        this.requirementToSyncPool = new Map();
        this.createdTimeStamp = createdTimeStamp;
        this.updatedTimeStamp = updatedTimeStamp;
    }
}
exports.Person = Person;
class OrdinaryPerson extends Person {
    constructor(name, walletInitValue, createdTimeStamp, updatedTimeStamp) {
        super({
            wallet: new Wallet_1.Wallet(walletInitValue),
            name,
            createdTimeStamp,
            updatedTimeStamp,
        });
    }
}
exports.OrdinaryPerson = OrdinaryPerson;
function getDateUtil(dateObj) {
    const date = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    return {
        date,
        month,
        year,
    };
}
