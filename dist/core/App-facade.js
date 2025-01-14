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
exports.ApplicationSingletoneFacade = void 0;
const core_utils_1 = require("../core-utils/core-utils");
const PersonFactory_1 = require("./person/factories/PersonFactory");
const RequirementFactory_1 = require("./requirement-command/factories/RequirementFactory");
const auth_service_1 = require("./services/auth-service");
const requirement_management_service_1 = require("./services/requirement-management-service");
class ApplicationSingletoneFacade {
    executeTransactsionById(id) {
        const user = this.user;
        if (user === null) {
            // this.browserLocalStorageManagementService.unsetAuthData()
            console.log('>>> inline log >>> user is null');
            // #warning // #todo onUserIsNull is not provided
            return;
        }
        console.log('>>> executeTransaction :: getting requirements...');
        const requirements = user.getAllReauirementCommands().filter((elem) => {
            return elem.getId() === id;
        });
        if (requirements.length > 1)
            throw new Error('multiple items by Id: ' + id);
        if (requirements.length < 1)
            throw new Error('no transactions by Id: ' + id);
        const requirement = requirements[0];
        requirement.execute(user);
        console.log('>>> executeTransaction :: ', requirements);
        console.log('>>> executeTransaction :: user has been mutated');
    }
    addRequirement(stats) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = stats.authToken; //  #warning
            // this.browserLocalStorageManagementService.getAuthData()
            if (authToken) {
                const data = yield this.requriementManagementService.createRequirement(stats, authToken);
                console.log('>>> create requirement :: response: ', data);
                if (data.payload === null) {
                    return null;
                }
                const newUser = this.personFactory.create(data.payload.name, data.payload.wallet, data.payload.createdTimeStamp, data.payload.updatedTimeStamp);
                if (newUser) {
                    data.payload.requirements.forEach((requirement) => {
                        const newRequirement = new RequirementFactory_1.RequirementFactory().create(Object.assign({}, requirement));
                        if (newRequirement) {
                            newUser.addRequirementCommand(newRequirement);
                        }
                    });
                    this.setUserLocally(newUser);
                }
            }
        });
    }
    deleteRequirement(reqId, authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = (0, core_utils_1.loggerCreator)(true
            // && false
            );
            log('try delete the requirement');
            log('req id: ' + reqId);
            const authData = authToken; // warning
            // this.browserLocalStorageManagementService.getAuthData()
            if (authData === null) {
                log('localstorage failed');
                return null;
            }
            log('local storage: ' + authData);
            const response = yield this.requriementManagementService.deleteRequirement(reqId, authData, this.authUserService);
            if (response.payload === null) {
                log('payload failed');
                return null;
            }
            log('payload: ' + response.payload.requirementId);
            return { id: response.payload.requirementId };
        });
    }
    userLogIn(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = (0, core_utils_1.loggerCreator)(true, 'USER LOGGING');
            log('user loging');
            log(userName + ' | ' + password);
            const logInResponse = yield this.HTTPServerComunicateService.getUserByUserNameAndPassword(userName, password);
            if (logInResponse.payload === null) {
                return null;
            }
            const { name, wallet, requirements } = logInResponse.payload.userStats;
            const createdTimeStamp = logInResponse.payload.userStats.createdTimeStamp;
            const updatedTimeStamp = logInResponse.payload.userStats.updatedTimeStamp;
            const newPerson = this.personFactory.create(name, wallet, createdTimeStamp, updatedTimeStamp);
            for (const requirement of requirements) {
                const createdReauirement = this.requirementFactory.create(Object.assign({}, requirement));
                if (createdReauirement === null)
                    continue;
                newPerson.addRequirementCommand(createdReauirement);
            }
            this.setUserLocally(newPerson);
            const token = logInResponse.payload.authToken;
            // this.browserLocalStorageManagementService.setAuthData(token)
            // #warning implement addEventListener
            return newPerson;
        });
    }
    userLogOut() {
        this.unsetUser();
        return true;
    }
    onUserIsUnset(cb) {
        this.userUnsetCallBackPull.push(cb);
    }
    onUserUpdate(cb) { }
    onAppUpdate(cb) {
        this.callbackPull.push(cb);
    }
    onUserSet(cb) {
        this.userIsSetCallBackPull.push(cb);
    }
    getLocalUserStats() {
        if (this.user === null) {
            return null;
        }
        return this.user;
    }
    getUserStats() {
        if (this.user === null) {
            return null;
        }
        const stats = {
            createdTimeStamp: this.user.getCreatedTimeStamp(),
            updatedTimeStamp: this.user.getUpdatedTimeStamp(),
            name: this.user.getName(),
            wallet: this.user.getWalletBalance(),
            requirements: this.user
                .getAllReauirementCommands()
                .map((transactinRequirement) => ({
                createdTimeStamp: transactinRequirement.getCreatedTimeStamp(),
                updatedTimeStamp: transactinRequirement.getUpdatedTimeStamp(),
                transactionTypeCode: transactinRequirement.getTransactionTypeCode(),
                dateToExecute: transactinRequirement.getDateToExecute(),
                deleted: transactinRequirement.getDeletedTheState(),
                description: transactinRequirement.getDescription(),
                id: transactinRequirement.getId(),
                executed: transactinRequirement.isExecuted(),
                title: transactinRequirement.getTitle(),
                value: transactinRequirement.getValue(),
            })),
        };
        return stats;
    }
    createUserRemote(userName, password, createUserService) {
        return __awaiter(this, void 0, void 0, function* () {
            return createUserService.execute(userName, password);
        });
    }
    subscriberOnMessage({ callBacks, message, }) {
        this.subscribers.push({ callBacks, message, executedTimeStamp: 0 });
    }
    emitMessage(message) {
        this.subscribers.forEach((subscriber) => {
            if (subscriber.message === message) {
                subscriber.callBacks.forEach((callBack) => {
                    callBack();
                });
            }
        });
    }
    setUserLocally(user) {
        this.user = user;
        // ---------
        user.on('requirement-updated', [
            () => this.emitMessage('updated'),
            () => {
                const userStats = this.getUserStats();
                console.log('>>> get user stats response ::: ', userStats);
                if (userStats === null) {
                    return;
                }
                const user = this.user;
                if (user === null)
                    return;
                const transactionsStatsArr = user.removeTransactionsToSyncAsStats();
                userStats.requirements = transactionsStatsArr;
                console.log('>>> set user locally ::: userStats:', userStats);
                this.HTTPServerComunicateService.pushUserDataStats(userStats, '')
                    .then((response) => {
                    if (response.payload === null)
                        return;
                    const newUser = this.personFactory.create(response.payload.name, response.payload.wallet, response.payload.createdTimeStamp, response.payload.updatedTimeStamp);
                    // const newRequirmentsPool:ITransactionRequirementCommand[] = []
                    console.log('>>> response payload requirements >>> ', response.payload.requirements);
                    response.payload.requirements.forEach((elem) => {
                        const transaction = this.requirementFactory.create(Object.assign({}, elem));
                        console.log('>>> new transaction >>> data ::: ', transaction);
                        if (transaction !== null) {
                            // newRequirmentsPool.push(transaction);
                            newUser.addRequirementCommand(transaction);
                        }
                    });
                    this.setUserLocally(newUser);
                })
                    .catch((e) => {
                    alert(e);
                });
            },
        ]);
        this.user.onUpdate((user) => { });
        this.userIsSetCallBackPull.forEach((callBack) => {
            const userData = this.getUserStats();
            if (userData) {
                callBack(userData);
            }
        });
    }
    static Instance(
    // localStorageService: ILocalStorageManagementService,
    serverConnector, eventService, authToken) {
        if (ApplicationSingletoneFacade.instance === null) {
            ApplicationSingletoneFacade.instance =
                new ApplicationSingletoneFacade(
                // localStorageService,
                serverConnector, eventService, authToken);
        }
        return ApplicationSingletoneFacade.instance;
    }
    addRequirementSchedule(task) { }
    updateRequirements() { }
    unsetUser() {
        // this.browserLocalStorageManagementService.unsetAuthData()
        // #warning 
        this.user = null;
        this.userUnsetCallBackPull.forEach((callback) => {
            callback();
        });
    }
    /* private  */ constructor(
    // localStorageService: ILocalStorageManagementService,
    serverConnector, eventService, authToken) {
        // subscribers
        this.subscribers = [];
        // observer pulls
        this.userIsSetCallBackPull = [];
        this.userUnsetCallBackPull = [];
        // --
        this.personFactory = new PersonFactory_1.PersonFactory();
        this.requirementFactory = new RequirementFactory_1.RequirementFactory();
        this.requriementManagementService = new requirement_management_service_1.RequrementManagementService(new RequirementFactory_1.RequirementFactory());
        this.authUserService = new auth_service_1.AuthUserService();
        this.eventServise = eventService;
        this.callbackPull = [];
        this.updatingStatus = false;
        // this.browserLocalStorageManagementService = localStorageService
        this.HTTPServerComunicateService = serverConnector;
        this.user = null;
        const authData = authToken;
        // this.browserLocalStorageManagementService.getAuthData()
        // #warning
        ;
        ((serverCommunicator, 
        // localstorageServ: ILocalStorageManagementService,
        personFactory, reqFactory) => __awaiter(this, void 0, void 0, function* () {
            if (authData) {
                this.updatingStatus = true;
                const response = yield serverCommunicator.getUserByAuthToken(authData);
                const responsedPayload = response.payload;
                if (responsedPayload === null) {
                    return;
                }
                // localstorageServ.setAuthData(responsedPayload.authToken) 
                // #warning
                const user = personFactory.create(responsedPayload.userStats.name, responsedPayload.userStats.wallet, responsedPayload.userStats.createdTimeStamp, responsedPayload.userStats.updatedTimeStamp);
                console.log('>>> server-connector :: created user', user);
                responsedPayload.userStats.requirements.forEach((elem) => {
                    const requirementInitData = elem;
                    const createdRequirement = reqFactory.create(requirementInitData);
                    if (createdRequirement !== null) {
                        user.addRequirementCommand(createdRequirement);
                    }
                });
                this.setUserLocally(user);
                const log__user = this.getUserStats();
                console.log('>>> app constructor ::  user name: ' + (log__user === null || log__user === void 0 ? void 0 : log__user.name));
            }
        }))(this.HTTPServerComunicateService, 
        // this.browserLocalStorageManagementService,
        this.personFactory, this.requirementFactory);
        // this.createUser()
    }
}
exports.ApplicationSingletoneFacade = ApplicationSingletoneFacade;
ApplicationSingletoneFacade.instance = null;
