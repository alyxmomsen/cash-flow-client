export interface ILocalStorageManagementService {
    setAuthData(value: string): any;
    getAuthData(): string | null;
    unsetAuthData(): any;
}
export declare class LocalStorageManagementService implements ILocalStorageManagementService {
    setAuthData(value: string): void;
    getAuthData(): string | null;
    unsetAuthData(): any;
}
