import { IWallet } from "../Wallet";
import { ITransactionRequirementCommand } from "../requirement-command/RequirementCommand";
import { IRrequirementsStatsType } from "../requirement-command/interfaces";
import { IUserStats } from "../types/common";
import { IPersonStatusSystem } from "./PersonStatus";
export type TStatus = {
    id: number;
    title: string;
};
export type TWalletTrackValue = {
    valueAfter: number;
    valueBefore: number;
    value: number;
    executionDate: number;
    transactionTypeCode: number;
};
export interface IPerson {
    getWalletBalance(): number;
    addRequirementCommand(requirementCommand: ITransactionRequirementCommand): ITransactionRequirementCommand | null;
    getRequirementCommandById(id: string): ITransactionRequirementCommand[];
    getActualRequirementCommands(): ITransactionRequirementCommand[];
    getAllReauirementCommands(): ITransactionRequirementCommand[];
    getExecutedRequirementCommands(): ITransactionRequirementCommand[];
    decrementWallet(value: number): void;
    getName(): string;
    incrementWallet(value: number): void;
    getWalletTrackForActualRequirements(): TWalletTrackValue[];
    getStatusDescription(): string;
    setStatus(status: IPersonStatusSystem): boolean;
    onUpdate(cb: (user: IPerson) => any): any;
    on(message: string, callBacks: (() => void)[]): void;
    removeTransactionsToSyncAsStats(): Omit<IRrequirementsStatsType, "userId" | "deleted" | "userId">[];
    getCreatedTimeStamp(): number;
    getUpdatedTimeStamp(): number;
    getStats(): Omit<IUserStats, "requirements" | "id" | "password"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    };
}
export declare abstract class Person implements IPerson {
    getCreatedTimeStamp(): number;
    getUpdatedTimeStamp(): number;
    getStats(): Omit<IUserStats, "requirements" | "id" | "password"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    };
    removeTransactionsToSyncAsStats(): Omit<IRrequirementsStatsType, "userId" | "deleted" | "userId">[];
    on(message: string, callBacks: (() => void)[]): void;
    onUpdate(cb: (user: IPerson) => any): any;
    getRequirementCommandById(id: string): ITransactionRequirementCommand[];
    getStatusDescription(): string;
    setStatus(status: IPersonStatusSystem): boolean;
    getWalletTrackForActualRequirements(): TWalletTrackValue[];
    getName(): string;
    incrementWallet(value: number): void;
    decrementWallet(value: number): void;
    addRequirementCommand(requirementCommand: ITransactionRequirementCommand): ITransactionRequirementCommand | null;
    getWalletBalance(): number;
    getActualRequirementCommands(): ITransactionRequirementCommand[];
    getAllReauirementCommands(): ITransactionRequirementCommand[];
    getExecutedRequirementCommands(): ITransactionRequirementCommand[];
    private emitMessage;
    constructor({ wallet, name, updatedTimeStamp, createdTimeStamp, }: Omit<IUserStats, "wallet" | "id" | "password" | "requirements"> & {
        wallet: IWallet;
    });
    protected name: string;
    protected wallet: IWallet;
    protected requirementCommandsPool: ITransactionRequirementCommand[];
    protected requirementToSyncPool: Map<string, IPoolItem<ITransactionRequirementCommand>>;
    protected averageSpending: number;
    protected status: IPersonStatusSystem;
    private onUpdateObserver;
    private subscribers;
    private createdTimeStamp;
    private updatedTimeStamp;
}
export declare class OrdinaryPerson extends Person {
    constructor(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number);
}
export declare function getDateUtil(dateObj: Date): {
    date: number;
    year: number;
    month: number;
};
export interface IPoolItem<T> {
    removed: boolean;
    data: T;
}
