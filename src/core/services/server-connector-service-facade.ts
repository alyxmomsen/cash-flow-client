import { getServerBaseUrl } from "../../core-utils";
import {
  IRequirementStats,
  IRrequirementsStatsType,
} from "../requirement-command/interfaces";
import {
  IUserStats,
  TFetchAuthResponseData,
  TFetchResponse,
} from "../types/common";
import { AuthUserService, IAuthService } from "./auth-service";
import { ILocalStorageManagementService } from "./local-storage-service";

export interface IHTTPServerCommunicateService {
  // getUserById(id: string): Promise<TFetchResponse<Omit<IUserStats, "id">>>;
  getUserByAuthToken(token: string): Promise<
    TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRequirementStats, "userId">[];
      };
      authToken: string;
    }>
  >;
  getUserByUserNameAndPassword(
    userName: string,
    password: string,
  ): Promise<
    TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      };
      authToken: string;
    }>
  >;
  replicateUserDataStats(
    user: Omit<IUserStats, "id" | "requirements" | "password"> & {
      requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    },
    authToken: string,
  ): Promise<
    TFetchResponse<
      Omit<IUserStats, "id" | "requirements" | "password"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      }
    >
  >;
  createUser(userName: string, password: string): Promise<boolean>;
  getUser(
    userName: string,
    password: string,
    authToken: { value: string } | null,
  ): Promise<IUserStats | null>;
}

export interface IFetchHeaders {
  "content-type": string;
  "x-auth": string;
}

export class HTTPServerComunicateService
  implements IHTTPServerCommunicateService
{
  async getUser(
    userName: string,
    password: string,
    authToken: { value: string } | null,
  ): Promise<IUserStats | null> {
    return null;
  }

  async createUser(userName: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(getServerBaseUrl() + "/registration", {
        // what exactly is the server expecting
        body: JSON.stringify({ userName, password }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData =
        (await response.json()) as TFetchResponse<TFetchAuthResponseData>;

      if (responseData.payload === null) return false;
      return true;
    } catch (err) {
      return false;
    }
  }

  async replicateUserDataStats(
    user: Omit<IUserStats, "id" | "requirements" | "password"> & {
      requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
    },
    authToken: string,
  ): Promise<
    TFetchResponse<
      Omit<IUserStats, "id" | "requirements" | "password"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      }
    >
  > {
    const authJWTToken = authToken;

    // localStorageService.getAuthData()

    if (authJWTToken === null)
      return {
        payload: null,
        status: {
          code: 0,
          details: "no auth token (in local storage)",
        },
      };

    const response = await fetch(getServerBaseUrl() + "/update-user", {
      headers: {
        "content-type": "application/json",
        "x-auth": authJWTToken,
      },
      body: JSON.stringify(user),
      method: "post",
    });

    const data = (await response.json()) as TFetchResponse<
      Omit<IUserStats, "id" | "requirements" | "password"> & {
        requirements: Omit<IRrequirementsStatsType, "userId">[];
      }
    >;

    console.log(">>> update user request ::  server respose: ", { data });

    return data;
  }

  async getUserByUserNameAndPassword(
    userName: string,
    password: string,
  ): Promise<
    TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      };
      authToken: string;
    }>
  > {
    const headers = {
      "content-type": "application/json",
    };

    const bodyInitData: { userName: string; password: string } = {
      userName,
      password,
    };

    const response = await fetch(
      getServerBaseUrl() + "/get-user-with-username-and-password",
      {
        headers: headers,
        method: "post",
        body: JSON.stringify(bodyInitData),
      },
    );

    const responseData = (await response.json()) as TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRrequirementsStatsType, "userId" | "deleted">[];
      };
      authToken: string;
    }>;

    return responseData;
  }
  async getUserByAuthToken(token: string): Promise<
    TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRequirementStats, "userId">[];
      };
      authToken: string;
    }>
  > {
    const headers = {
      "content-type": "application/json",
      "x-auth": token,
    };

    const response = await fetch(getServerBaseUrl() + "/get-user-with-token", {
      headers: headers,
      method: "post",
    });

    const responseData = (await response.json()) as TFetchResponse<{
      userStats: Omit<IUserStats, "id"> & {
        requirements: Omit<IRequirementStats, "userId">[];
      };
      authToken: string;
    }>;

    /* ----- */

    // some actions , if you need

    /* ----- */

    return responseData;
  }

  // async getUserById(
  //   id: string,
  // ): Promise<TFetchResponse<Omit<IUserStats, "id">>> {
  //   const response = await this.getUserService.byId(id);
  //   return response;
  // }

  private authUserService: IAuthService;

  constructor() {
    // this.getUserService = new GetUserService();
    this.authUserService = new AuthUserService();
  }
}
