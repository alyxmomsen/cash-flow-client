"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashFlowApp = void 0;
const App_facade_1 = require("./core/App-facade");
const App_event_1 = require("./core/events/App-event");
const server_connector_service_facade_1 = require("./core/services/server-connector-service-facade");
exports.cashFlowApp = new App_facade_1.ApplicationSingletoneFacade(
// new LocalStorageManagementService(),
new server_connector_service_facade_1.HTTPServerComunicateService(), new App_event_1.EventService(), '' // #warning token is not provided
);
