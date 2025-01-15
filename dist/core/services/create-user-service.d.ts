import { ICreateUserResponseData } from "../App-facade";
export interface ICreateUserService {
    execute(userName: string, password: string): Promise<ICreateUserResponseData>;
}
export declare class CreateUserService implements ICreateUserService {
    execute(userName: string, password: string): Promise<ICreateUserResponseData>;
    constructor();
}
