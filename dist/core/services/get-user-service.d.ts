import { IUserStats, TFetchResponse } from "../types/common";
export interface IGetUserService {
    byId(id: string): Promise<TFetchResponse<Omit<IUserStats, "id">>>;
}
export declare class GetUserService implements IGetUserService {
    byId(id: string): Promise<TFetchResponse<Omit<IUserStats, "id">>>;
}
