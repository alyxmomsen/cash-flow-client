import { getServerBaseUrl } from "../../core-utils";
import {
  IAuthUserResponseData,
  ICheckAuthTokenResponseData,
} from "../App-facade";
import { TFetchAuthResponseData, TFetchResponse } from "../types/common";

export interface IAuthService {
  execute(userName: string, password: string): Promise<IAuthUserResponseData>;
  checkAuth(
    token: string,
  ): Promise<TFetchResponse<ICheckAuthTokenResponseData>>;
}

export class AuthUserService implements IAuthService {
  async checkAuth(
    token: string,
  ): Promise<TFetchResponse<ICheckAuthTokenResponseData>> {
    const response = await fetch(
      getServerBaseUrl() + "/check-user-auth-protected-ep",
      {
        headers: {
          "content-type": "application/json",
          "x-auth": token,
        },
        method: "post",
      },
    );

    const data =
      (await response.json()) as TFetchResponse<ICheckAuthTokenResponseData>;

    return data;
  }
  async execute(
    userName: string,
    password: string,
  ): Promise<IAuthUserResponseData> {
    const response = await fetch(getServerBaseUrl() + "/auth", {
      method: "post",
      body: JSON.stringify({ userName, password }),
      headers: {
        "content-type": "application/json",
      },
    });

    const data =
      (await response.json()) as TFetchResponse<TFetchAuthResponseData>;

    const { payload, status } = data;

    if (payload && status.code < 1) {
      // payload
      localStorage.setItem("userId", payload.userId);

      return {
        payload: {
          userId: payload.userId,
        },
        status: {
          code: status.code,
          details: status.details,
        },
      };
    } else {
      return {
        payload: payload ? { userId: payload.userId } : payload,
        status: {
          code: status.code,
          details: status.details,
        },
      };
    }
  }

  constructor() {}
}
