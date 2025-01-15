import { IPerson } from "../person/Person";
import { IRrequirementsStatsType } from "./interfaces";

export interface ITransactionRequirementCommand {
  execute(person: IPerson): boolean;
  getId(): string;
  getDescription(): string;
  getTitle(): string;
  getValue(): number;
  executeWithValue(value: number): number;
  getDateToExecute(): number;
  isExecuted(): null | {
    executedTimeStamp: number;
  };
  getTransactionTypeCode(): number;
  getDeletedTheState(): boolean;
  subscribeOnUpdate(cb: (rquirementiD: string) => void): void;
  getCreatedTimeStamp(): number;
  getUpdatedTimeStamp(): number;
}

abstract class TransactionRequirementCommand
  implements ITransactionRequirementCommand
{
  abstract executeWithValue(value: number): number;

  abstract execute(person: IPerson): boolean;

  getCreatedTimeStamp(): number {
    return this.createdTimeStamp;
  }

  getUpdatedTimeStamp(): number {
    return this.updatedTimeStamp;
  }

  subscribeOnUpdate(cb: (requirementId: string) => void): void {
    this.observeables.push({ cb: () => cb(this.id), executedTimeStamp: 0 });
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getTransactionTypeCode(): number {
    return this.transactionTypeCode;
  }

  isExecuted(): null | {
    executedTimeStamp: number;
  } {
    return this.executed;
  }

  getDateToExecute(): number {
    return this.dateToExecute;
  }

  getDescription(): string {
    return this.description;
  }

  getValue(): number {
    return this.value;
  }

  getDeletedTheState(): boolean {
    return this.deleted;
  }

  constructor({
    id,
    value,
    title,
    description,
    dateToExecute,
    transactionTypeCode,
    executed,
    createdTimeStamp,
    updatedTimeStamp,
  }: Omit<IRrequirementsStatsType, "deleted" | "userId">) {
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
  protected id: string;
  protected title: string;
  protected value: number;
  protected description: string;
  protected dateToExecute: number;
  protected executed: null | {
    executedTimeStamp: number;
  };
  protected transactionTypeCode: number;
  protected deleted: boolean;
  protected observeables: { cb: () => void; executedTimeStamp: number }[];
  protected createdTimeStamp: number;
  protected updatedTimeStamp: number;
}

export class IncrementMoneyRequirementCommand extends TransactionRequirementCommand {
  execute(person: IPerson): boolean {
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

  executeWithValue(value: number): number {
    return value + this.value;
  }

  constructor(
    stats: Omit<
      IRrequirementsStatsType,
      "transactionTypeCode" | "deleted" | "userId"
    >,
  ) {
    super({ ...stats, transactionTypeCode: 0 });
  }
}

export class DecrementMoneyRequirementCommand extends TransactionRequirementCommand {
  executeWithValue(value: number): number {
    return value - this.value;
  }

  getValue(): number {
    return this.value;
  }

  getDescription(): string {
    return `pay ${this.value}`;
  }

  execute(person: IPerson): boolean {
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

  constructor({
    id,
    value,
    title,
    description,
    dateToExecute,
    executed,
    createdTimeStamp,
    updatedTimeStamp,
  }: Omit<
    IRrequirementsStatsType,
    "userId" | "deleted" | "transactionTypeCode"
  >) {
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
