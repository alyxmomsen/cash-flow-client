import { IRequirementStats, IRrequirementsStatsType } from '../requirement-command/interfaces';
import { IUserStats, TFetchResponse } from '../types/common';
export interface IHTTPServerCommunicateService {
    getUserById(id: string): Promise<TFetchResponse<Omit<IUserStats, 'id'>>>;
    getUserByAuthToken(token: string): Promise<TFetchResponse<{
        userStats: Omit<IUserStats, 'id'> & {
            requirements: Omit<IRequirementStats, 'userId'>[];
        };
        authToken: string;
    }>>;
    getUserByUserNameAndPassword(userName: string, password: string): Promise<TFetchResponse<{
        userStats: Omit<IUserStats, 'id'> & {
            requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
        };
        authToken: string;
    }>>;
    pushUserDataStats(user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }, authToken: string): Promise<TFetchResponse<Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }>>;
}
export interface IFetchHeaders {
    'content-type': string;
    'x-auth': string;
}
export declare class HTTPServerComunicateService implements IHTTPServerCommunicateService {
    pushUserDataStats(user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }, authToken: string): Promise<TFetchResponse<Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }>>;
    getUserByUserNameAndPassword(userName: string, password: string): Promise<TFetchResponse<{
        userStats: Omit<IUserStats, 'id'> & {
            requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
        };
        authToken: string;
    }>>;
    getUserByAuthToken(token: string): Promise<TFetchResponse<{
        userStats: Omit<IUserStats, 'id'> & {
            requirements: Omit<IRequirementStats, 'userId'>[];
        };
        authToken: string;
    }>>;
    getUserById(id: string): Promise<TFetchResponse<Omit<IUserStats, 'id'>>>;
    private getUserService;
    private authUserService;
    constructor();
}
