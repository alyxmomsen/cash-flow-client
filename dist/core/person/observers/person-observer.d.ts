import { IPerson } from "../Person";
export interface IPersonObserver {
    execute(user: IPerson): any;
    addObserveable(cb: (user: IPerson) => any): any;
}
export declare class PersonObserver implements IPersonObserver {
    private observeables;
    addObserveable(cb: (user: IPerson) => any): any;
    execute(user: IPerson): any;
    constructor();
}
