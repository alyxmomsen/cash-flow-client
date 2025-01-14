"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecrementMoneyRequirementCommand = exports.IncrementMoneyRequirementCommand = void 0;
class TransactionRequirementCommand {
    getCreatedTimeStamp() {
        return this.createdTimeStamp;
    }
    getUpdatedTimeStamp() {
        return this.updatedTimeStamp;
    }
    subscribeOnUpdate(cb) {
        this.observeables.push({ cb: () => cb(this.id), executedTimeStamp: 0 });
    }
    getId() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getTransactionTypeCode() {
        return this.transactionTypeCode;
    }
    isExecuted() {
        return this.executed;
    }
    getDateToExecute() {
        return this.dateToExecute;
    }
    getDescription() {
        return this.description;
    }
    getValue() {
        return this.value;
    }
    getDeletedTheState() {
        return this.deleted;
    }
    constructor({ id, value, title, description, dateToExecute, transactionTypeCode, executed, createdTimeStamp, updatedTimeStamp, }) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.dateToExecute = dateToExecute;
        this.executed = executed;
        this.title = title;
        this.transactionTypeCode = transactionTypeCode;
        this.deleted = false;
        this.observeables = [];
        this.createdTimeStamp = createdTimeStamp;
        this.updatedTimeStamp = updatedTimeStamp;
    }
}
class IncrementMoneyRequirementCommand extends TransactionRequirementCommand {
    execute(person) {
        if (this.executed) {
            return false;
        }
        const balanceBefore = person.getWalletBalance();
        person.incrementWallet(this.value);
        this.executed = {
            executedTimeStamp: Date.now(),
        };
        this.observeables.forEach((elem) => {
            elem.cb();
            elem.executedTimeStamp = Date.now();
        });
        return true;
    }
    executeWithValue(value) {
        return value + this.value;
    }
    constructor(stats) {
        super(Object.assign(Object.assign({}, stats), { transactionTypeCode: 0 }));
    }
}
exports.IncrementMoneyRequirementCommand = IncrementMoneyRequirementCommand;
class DecrementMoneyRequirementCommand extends TransactionRequirementCommand {
    executeWithValue(value) {
        return value - this.value;
    }
    getValue() {
        return this.value;
    }
    getDescription() {
        return `pay ${this.value}`;
    }
    execute(person) {
        if (this.executed) {
            return false;
        }
        const balanceBefore = person.getWalletBalance();
        person.decrementWallet(this.value);
        this.executed = {
            executedTimeStamp: Date.now(),
        };
        this.observeables.forEach((elem) => {
            elem.cb();
            elem.executedTimeStamp = Date.now();
        });
        return true;
    }
    constructor({ id, value, title, description, dateToExecute, executed, createdTimeStamp, updatedTimeStamp, }) {
        super({
            id,
            value,
            title,
            description,
            dateToExecute,
            executed,
            createdTimeStamp,
            updatedTimeStamp,
            transactionTypeCode: 1,
        });
    }
}
exports.DecrementMoneyRequirementCommand = DecrementMoneyRequirementCommand;
