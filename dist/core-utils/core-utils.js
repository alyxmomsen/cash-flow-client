"use strict";
// import process from "process";j
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
exports.getServerBaseUrl = getServerBaseUrl;
exports.loggerCreator = loggerCreator;
class Registry {
}
exports.Registry = Registry;
function getServerBaseUrl(mode = true) {
    // const outside = mode ? process.env.ServerBaseURLOutSide : null;
    // const localUrl = process.env.ServerBaseURLLocal;
    return /* outside || localUrl ||  */ "http://127.0.0.1:3030";
}
function loggerCreator(isOn, titleValue = "unnamed log") {
    const title = titleValue;
    return (data) => {
        if (isOn) {
            console.log(`>>> ${title} >>> ${data}`);
        }
    };
}
