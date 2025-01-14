import { IPerson, OrdinaryPerson } from '../Person'

export interface IPersonFacory {
    create(
        name: string,
        walletInitValue: number,
        createdTimeStamp: number,
        updatedTimeStamp: number
    ): IPerson
}

export class PersonFactory implements IPersonFacory {
    create(
        name: string,
        walletInitValue: number,
        createdTimeStamp: number,
        updatedTimeStamp: number
    ): IPerson {
        return new OrdinaryPerson(
            name,
            walletInitValue,
            createdTimeStamp,
            updatedTimeStamp
        )
    }

    constructor() {}
}
