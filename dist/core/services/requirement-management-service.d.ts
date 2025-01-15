import { TFetchResponse } from "./../types/common";
import { IRequirementFactory } from "../requirement-command/factories/RequirementFactory";
import { IRrequirementsStatsType } from "../requirement-command/interfaces";
import { IUserStats } from "../types/common";
import { IAuthService } from "./auth-service";
export interface IRequirementManagementService {
    createRequirement(fields: Omit<IRrequirementsStatsType, "id" | "userId" | "createdTimeStamp" | "updatedTimeStamp" | "deleted" | "executed">, authToken: string): Promise<TFetchResponse<IUserStats & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    }>>;
    deleteRequirement(reqId: string, authToken: string, checkAuthMiddleWare: IAuthService): Promise<TFetchResponse<{
        requirementId: string;
    }>>;
}
export declare class RequrementManagementService implements IRequirementManagementService {
    deleteRequirement(reqId: string, authToken: string, checkAuthMiddleWare: IAuthService): Promise<TFetchResponse<{
        requirementId: string;
    }>>;
    createRequirement(fields: Omit<IRrequirementsStatsType, "id" | "userId" | "createdTimeStamp" | "updatedTimeStamp" | "deleted" | "executed">, authToken: string): Promise<TFetchResponse<IUserStats & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    }>>;
    constructor(factory: IRequirementFactory);
}
