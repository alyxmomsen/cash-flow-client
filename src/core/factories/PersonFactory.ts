import { IPerson, OrdinaryPerson, Person } from "../person/Person";
import { Factory } from "./AbstractFactory";

export abstract class PersonFactory extends Factory<IPerson> {
  abstract create(
    name: string,
    walletInitValue: number,
    createdTimeStamp: number,
    updatedTimeStamp: number,
  ): IPerson;

  constructor() {
    super();
  }
}

export class PlayerPersonFactory extends PersonFactory {
  create(
    name: string,
    walletInitValue: number,
    createdTimeStamp: number,
    updatedTimeStamp: number,
  ): IPerson {
    return new OrdinaryPerson(
      name,
      walletInitValue,
      createdTimeStamp,
      updatedTimeStamp,
    );
  }
}
