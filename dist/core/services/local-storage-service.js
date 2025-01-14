"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageManagementService = void 0;
class LocalStorageManagementService {
    setAuthData(value) {
        window.localStorage.setItem('userId', value);
    }
    getAuthData() {
        const value = window.localStorage.getItem('userId');
        return value;
    }
    unsetAuthData() {
        window.localStorage.removeItem('userId');
    }
}
exports.LocalStorageManagementService = LocalStorageManagementService;
