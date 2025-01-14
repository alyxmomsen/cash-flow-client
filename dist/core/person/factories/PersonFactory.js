"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonFactory = void 0;
const Person_1 = require("../Person");
class PersonFactory {
    create(name, walletInitValue, createdTimeStamp, updatedTimeStamp) {
        return new Person_1.OrdinaryPerson(name, walletInitValue, createdTimeStamp, updatedTimeStamp);
    }
    constructor() { }
}
exports.PersonFactory = PersonFactory;
