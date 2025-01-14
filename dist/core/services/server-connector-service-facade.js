"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServerComunicateService = void 0;
const core_utils_1 = require("../../core-utils/core-utils");
const auth_service_1 = require("./auth-service");
const get_user_service_1 = require("./get-user-service");
class HTTPServerComunicateService {
    pushUserDataStats(user, authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const authJWTToken = authToken;
            // localStorageService.getAuthData()
            if (authJWTToken === null)
                return {
                    payload: null,
                    status: {
                        code: 0,
                        details: 'no auth token (in local storage)',
                    },
                };
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + '/update-user', {
                headers: {
                    'content-type': 'application/json',
                    'x-auth': authJWTToken,
                },
                body: JSON.stringify(user),
                method: 'post',
            });
            const data = (yield response.json());
            console.log('>>> update user request ::  server respose: ', { data });
            return data;
        });
    }
    getUserByUserNameAndPassword(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'content-type': 'application/json',
            };
            const bodyInitData = {
                userName,
                password,
            };
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + '/get-user-with-username-and-password', {
                headers: headers,
                method: 'post',
                body: JSON.stringify(bodyInitData),
            });
            const responseData = (yield response.json());
            return responseData;
        });
    }
    getUserByAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'content-type': 'application/json',
                'x-auth': token,
            };
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + '/get-user-with-token', {
                headers: headers,
                method: 'post',
            });
            const responseData = (yield response.json());
            /* ----- */
            // some actions , if you need
            /* ----- */
            return responseData;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getUserService.byId(id);
            return response;
        });
    }
    constructor() {
        this.getUserService = new get_user_service_1.GetUserService();
        this.authUserService = new auth_service_1.AuthUserService();
    }
}
exports.HTTPServerComunicateService = HTTPServerComunicateService;
