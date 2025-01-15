import { IPerson } from "../Person";
export interface IPersonFacory {
    create(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number): IPerson;
}
export declare class PersonFactory implements IPersonFacory {
    create(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number): IPerson;
    constructor();
}
