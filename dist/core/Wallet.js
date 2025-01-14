"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
class Wallet {
    setValue(value) {
        this.balance = value;
        return this.balance;
    }
    add(value) {
        const result = this.balance + value;
        this.balance = result;
        return this.balance;
    }
    getBalance() {
        return this.balance;
    }
    remove(value) {
        const result = this.balance - value;
        this.balance = result;
        return this.balance;
    }
    constructor(initValue = 0) {
        this.balance = initValue;
    }
}
exports.Wallet = Wallet;
