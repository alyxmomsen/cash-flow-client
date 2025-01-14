import { IPerson } from '../person/Person';
import { IRrequirementsStatsType } from './interfaces';
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
declare abstract class TransactionRequirementCommand implements ITransactionRequirementCommand {
    abstract executeWithValue(value: number): number;
    abstract execute(person: IPerson): boolean;
    getCreatedTimeStamp(): number;
    getUpdatedTimeStamp(): number;
    subscribeOnUpdate(cb: (requirementId: string) => void): void;
    getId(): string;
    getTitle(): string;
    getTransactionTypeCode(): number;
    isExecuted(): null | {
        executedTimeStamp: number;
    };
    getDateToExecute(): number;
    getDescription(): string;
    getValue(): number;
    getDeletedTheState(): boolean;
    constructor({ id, value, title, description, dateToExecute, transactionTypeCode, executed, createdTimeStamp, updatedTimeStamp, }: Omit<IRrequirementsStatsType, 'deleted' | 'userId'>);
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
    protected observeables: {
        cb: () => void;
        executedTimeStamp: number;
    }[];
    protected createdTimeStamp: number;
    protected updatedTimeStamp: number;
}
export declare class IncrementMoneyRequirementCommand extends TransactionRequirementCommand {
    execute(person: IPerson): boolean;
    executeWithValue(value: number): number;
    constructor(stats: Omit<IRrequirementsStatsType, 'transactionTypeCode' | 'deleted' | 'userId'>);
}
export declare class DecrementMoneyRequirementCommand extends TransactionRequirementCommand {
    executeWithValue(value: number): number;
    getValue(): number;
    getDescription(): string;
    execute(person: IPerson): boolean;
    constructor({ id, value, title, description, dateToExecute, executed, createdTimeStamp, updatedTimeStamp, }: Omit<IRrequirementsStatsType, 'userId' | 'deleted' | 'transactionTypeCode'>);
}
export {};
