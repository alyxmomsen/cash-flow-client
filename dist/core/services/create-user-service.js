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
exports.CreateUserService = void 0;
const core_utils_1 = require("../../core-utils/core-utils");
class CreateUserService {
    execute(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userName === "string" && typeof password === "string") {
                if (userName.length < 3 && password.length < 6) {
                    return Promise.resolve({
                        status: {
                            code: 1,
                            details: "incorrect password or user name",
                        },
                        payload: null,
                    });
                }
                try {
                    const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + "/registration", {
                        method: "post",
                        body: JSON.stringify({
                            userName,
                            password,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = (yield response.json());
                    const payload = data.payload;
                    if (data.status.code > 0) {
                        return Promise.resolve({
                            payload: null,
                            status: {
                                code: 4,
                                details: data.status.details,
                            },
                        });
                    }
                    return Promise.resolve({
                        payload: payload
                            ? {
                                userId: payload.userId,
                            }
                            : null,
                        status: {
                            code: 0,
                            details: "user created successfully",
                        },
                    });
                }
                catch (e) {
                    return Promise.resolve({
                        payload: null,
                        status: {
                            code: 3,
                            details: "fetch irror",
                        },
                    });
                }
            }
            else {
                return Promise.resolve({
                    status: {
                        code: 2,
                        details: "incorrect data type",
                    },
                    payload: null,
                });
            }
        });
    }
    constructor() { }
}
exports.CreateUserService = CreateUserService;
