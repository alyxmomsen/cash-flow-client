export interface IRegistry<T> {
}
export declare abstract class Registry<T> implements IRegistry<T> {
    protected registry: T[];
    abstract isExist(value: T): boolean;
    constructor();
}
export declare class IdRegistry extends Registry<number> {
    isExist(value: number): boolean;
}
