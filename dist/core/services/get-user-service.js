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
exports.GetUserService = void 0;
const core_utils_1 = require("../../core-utils/core-utils");
class GetUserService {
    byId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch((0, core_utils_1.getServerBaseUrl)() + "/get-user-protected", {
                headers: {
                    "content-type": "application/json",
                    "x-auth": id,
                },
                method: "post",
            });
            const data = (yield response.json());
            // const { payload, status } = data
            return data;
        });
    }
}
exports.GetUserService = GetUserService;
