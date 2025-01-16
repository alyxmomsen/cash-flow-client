import { TFetchResponse } from "./../types/common";

import { IRequirementFactory } from "../requirement-command/factories/RequirementFactory";
import { IRrequirementsStatsType } from "../requirement-command/interfaces";
import { IUserStats } from "../types/common";
import { IAuthService } from "./auth-service";
import { getServerBaseUrl } from "../../core-utils";
// import { env } from 'process'

export interface IRequirementManagementService {
  createRequirement(
    fields: Omit<
      IRrequirementsStatsType,
      | "id"
      | "userId"
      | "createdTimeStamp"
      | "updatedTimeStamp"
      | "deleted"
      | "executed"
    >,
    authToken: string,
  ): Promise<
    TFetchResponse<
      IUserStats & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      }
    >
  >;

  deleteRequirement(
    reqId: string,
    authToken: string,
    checkAuthMiddleWare: IAuthService,
  ): Promise<
    TFetchResponse<{
      requirementId: string;
    }>
  >;
}

export class RequrementManagementService
  implements IRequirementManagementService
{
  async deleteRequirement(
    reqId: string,
    authToken: string,
    checkAuthMiddleWare: IAuthService,
  ): Promise<
    TFetchResponse<{
      requirementId: string;
    }>
  > {
    // const checkAuthResponse = await checkAuthMiddleWare.checkAuth(authToken)

    const response = await fetch(
      getServerBaseUrl() + "/delete-requirement-protected-ep",
      {
        headers: {
          "x-auth": authToken,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          requirementId: reqId,
        }),
        method: "post",
      },
    );

    const data = (await response.json()) as TFetchResponse<{
      requirementId: string;
    }>;

    return data;
  }

  async createRequirement(
    fields: Omit<
      IRrequirementsStatsType,
      | "id"
      | "userId"
      | "createdTimeStamp"
      | "updatedTimeStamp"
      | "deleted"
      | "executed"
    >,
    authToken: string,
  ): Promise<
    TFetchResponse<
      IUserStats & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      }
    >
  > {
    try {
      const body: Omit<
        IRrequirementsStatsType,
        | "id"
        | "userId"
        | "createdTimeStamp"
        | "updatedTimeStamp"
        | "deleted"
        | "executed"
      > = {
        ...fields,
      };

      // #hardcode #warning
      const response = await fetch(
        getServerBaseUrl() + "/add-user-requirements-protected",
        {
          headers: {
            "content-type": "application/json",
            "x-auth": authToken,
          },
          body: JSON.stringify({
            ...body,
          }),
          method: "post",
        },
      );
      const data = (await response.json()) as TFetchResponse<
        IUserStats & {
          requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
        }
      >;

      return data;
    } catch (e) {
      return {
        payload: null,
        status: {
          code: 343,
          details: "bad mood",
        },
      };
    }
  }

  constructor(factory: IRequirementFactory) {}
}
