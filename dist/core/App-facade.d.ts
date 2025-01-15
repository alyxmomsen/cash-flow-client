import { IEventService } from './events/App-event';
import { IPerson } from './person/Person';
import { IRequirementStats, IRrequirementsStatsType } from './requirement-command/interfaces';
import { ITransactionRequirementCommand } from './requirement-command/RequirementCommand';
import { ICreateUserService } from './services/create-user-service';
import { IHTTPServerCommunicateService } from './services/server-connector-service-facade';
import { ITask } from './Task';
import { IUserStats } from './types/common';
export interface IApplicationSingletoneFacade {
    executeTransactsionById(id: string): void;
    deleteRequirement(reqId: string, authToken: string): Promise<Pick<IRequirementStats, 'id'> | null>;
    addRequirement(stats: Omit<IRrequirementsStatsType, 'id' | 'userId' | 'createdTimeStamp' | 'updatedTimeStamp' | 'deleted' | 'executed'>): Promise<any>;
    addRequirementSchedule(task: ITask<ITransactionRequirementCommand, IPerson>): void;
    createUserRemote(userName: string, password: string, createUserService: ICreateUserService): Promise<ICreateUserResponseData>;
    getLocalUserStats(): IPerson | null;
    getUserStats(): (Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }) | null;
    userLogIn(userName: string, password: string): Promise<IPerson | null>;
    userLogOut(): any;
    onAppUpdate(cb: () => void): void;
    onUserSet(cb: (user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }) => void): any;
    onUserUpdate(cb: () => any): any;
    subscriberOnMessage({ callBacks, message, }: {
        message: string;
        callBacks: (() => void)[];
        executedTimeStamp: number;
    }): void;
}
export interface IResponseData<T> {
    payload: T | null;
    status: {
        code: number;
        details: string;
    };
}
export interface ICreateUserResponseData extends IResponseData<{
    userId: string;
}> {
}
export interface IAuthUserResponseData extends ICreateUserResponseData {
}
export interface ICheckAuthTokenResponseData {
    token: string;
}
export declare class ApplicationSingletoneFacade implements IApplicationSingletoneFacade {
    executeTransactsionById(id: string): void;
    addRequirement(stats: Omit<IRrequirementsStatsType, 'id' | 'userId' | 'createdTimeStamp' | 'updatedTimeStamp' | 'deleted' | 'executed'> & {
        authToken: string;
    }): Promise<any>;
    deleteRequirement(reqId: string, authToken: string): Promise<Pick<IRequirementStats, 'id'> | null>;
    userLogIn(userName: string, password: string): Promise<IPerson | null>;
    userLogOut(): boolean;
    onUserIsUnset(cb: () => any): void;
    onUserUpdate(cb: () => any): void;
    onAppUpdate(cb: () => void): void;
    onUserSet(cb: (user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }) => void): any;
    getLocalUserStats(): IPerson | null;
    getUserStats(): (Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
        requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[];
    }) | null;
    createUserRemote(userName: string, password: string, createUserService: ICreateUserService): Promise<ICreateUserResponseData>;
    subscriberOnMessage({ callBacks, message, }: {
        message: string;
        callBacks: (() => void)[];
    }): void;
    private emitMessage;
    private setUserLocally;
    static Instance(serverConnector: IHTTPServerCommunicateService, eventService: IEventService, authToken: string): ApplicationSingletoneFacade;
    addRequirementSchedule(task: ITask<ITransactionRequirementCommand, IPerson>): void;
    private subscribers;
    private requriementManagementService;
    private authUserService;
    private updatingStatus;
    private personFactory;
    private requirementFactory;
    private user;
    private static instance;
    private eventServise;
    private HTTPServerComunicateService;
    private callbackPull;
    private userIsSetCallBackPull;
    private userUnsetCallBackPull;
    private updateRequirements;
    private unsetUser;
    constructor(authToken: string);
}
