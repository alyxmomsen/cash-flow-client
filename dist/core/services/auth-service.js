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
exports.AuthUserService = void 0;
const core_utils_1 = require("../../core-utils/core-utils");
class AuthUserService {
    checkAuth(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + '/check-user-auth-protected-ep', {
                headers: {
                    'content-type': 'application/json',
                    'x-auth': token,
                },
                method: 'post',
            });
            const data = (yield response.json());
            return data;
        });
    }
    execute(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + '/auth', {
                method: 'post',
                body: JSON.stringify({ userName, password }),
                headers: {
                    'content-type': 'application/json',
                },
            });
            const data = (yield response.json());
            const { payload, status } = data;
            if (payload && status.code < 1) {
                // payload
                localStorage.setItem('userId', payload.userId);
                return {
                    payload: {
                        userId: payload.userId,
                    },
                    status: {
                        code: status.code,
                        details: status.details,
                    },
                };
            }
            else {
                return {
                    payload: payload ? { userId: payload.userId } : payload,
                    status: {
                        code: status.code,
                        details: status.details,
                    },
                };
            }
        });
    }
    constructor() { }
}
exports.AuthUserService = AuthUserService;
