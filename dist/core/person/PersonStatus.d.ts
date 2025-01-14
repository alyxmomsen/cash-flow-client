export interface IPersonStatusSystem {
    getDate(): number;
    getDescription(): string;
    getDifference(): number;
}
declare abstract class PersonStatusSystem implements IPersonStatusSystem {
    protected id: number;
    protected title: string;
    protected date: number;
    abstract getDate(): number;
    getDifference(): number;
    abstract getDescription(): string;
    constructor(title: string, id: number);
}
export declare class GoingSleepStatus extends PersonStatusSystem {
    getDate(): number;
    getDescription(): string;
    constructor();
}
export declare class AwakeningStatus extends PersonStatusSystem {
    getDate(): number;
    getDescription(): string;
    constructor();
}
export declare abstract class PersonStatusFactory {
    protected links: PersonStatusFactory[];
    protected title: string;
    abstract instance(): IPersonStatusSystem;
    addLinkFactory(linkFactory: PersonStatusFactory): void;
    getLinks(): PersonStatusFactory[];
    getTitle(): string;
    constructor(title: string);
}
export declare class AwakenStatusFactory extends PersonStatusFactory {
    instance(): IPersonStatusSystem;
    constructor();
}
export declare class SlepStatusFactory extends PersonStatusFactory {
    instance(): IPersonStatusSystem;
    constructor();
}
export {};
