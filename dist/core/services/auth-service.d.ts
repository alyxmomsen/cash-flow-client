import { IAuthUserResponseData, ICheckAuthTokenResponseData } from "../App-facade";
import { TFetchResponse } from "../types/common";
export interface IAuthService {
    execute(userName: string, password: string): Promise<IAuthUserResponseData>;
    checkAuth(token: string): Promise<TFetchResponse<ICheckAuthTokenResponseData>>;
}
export declare class AuthUserService implements IAuthService {
    checkAuth(token: string): Promise<TFetchResponse<ICheckAuthTokenResponseData>>;
    execute(userName: string, password: string): Promise<IAuthUserResponseData>;
    constructor();
}
