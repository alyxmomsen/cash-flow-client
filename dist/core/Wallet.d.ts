export interface IWallet {
    add(value: number): number;
    remove(value: number): number;
    getBalance(): number;
    setValue(value: number): number;
}
export declare class Wallet implements IWallet {
    protected balance: number;
    setValue(value: number): number;
    add(value: number): number;
    getBalance(): number;
    remove(value: number): number;
    constructor(initValue?: number);
}
