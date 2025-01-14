export declare abstract class Factory<T> {
    abstract create(name: string, walletInitValue: number, createdTimeStamp: number, updatedTimeStamp: number): T;
}
