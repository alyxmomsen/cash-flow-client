import { ApplicationSingletoneFacade } from './core/App-facade'
import { EventService } from './core/events/App-event'
import { HTTPServerComunicateService } from './core/services/server-connector-service-facade'

export const cashFlowApp = new ApplicationSingletoneFacade  (
    // new LocalStorageManagementService(),
    new HTTPServerComunicateService(),
    new EventService(),
    '' // #warning token is not provided
)