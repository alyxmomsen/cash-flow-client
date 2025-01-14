import { IPerson } from '../person/Person';
import { Factory } from './AbstractFactory';
export declare abstract class PersonFactory extends Factory<IPerson> {
    abstract create(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number): IPerson;
    constructor();
}
export declare class PlayerPersonFactory extends PersonFactory {
    create(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number): IPerson;
}
