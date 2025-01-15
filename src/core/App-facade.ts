
import { loggerCreator } from '../core-utils/core-utils'
import { EventService, IEventService } from './events/App-event'
import { IPersonFacory, PersonFactory } from './person/factories/PersonFactory'
import { IPerson } from './person/Person'
import {
    IRequirementFactory,
    RequirementFactory,
} from './requirement-command/factories/RequirementFactory'
import {
    IRequirementStats,
    IRrequirementsStatsType,
} from './requirement-command/interfaces'
import { ITransactionRequirementCommand } from './requirement-command/RequirementCommand'
import { AuthUserService, IAuthService } from './services/auth-service'
import { ICreateUserService } from './services/create-user-service'
import { ILocalStorageManagementService } from './services/local-storage-service'
import {
    IRequirementManagementService,
    RequrementManagementService,
} from './services/requirement-management-service'
import { HTTPServerComunicateService, IHTTPServerCommunicateService } from './services/server-connector-service-facade'

import { ITask } from './Task'
import { IUserStats } from './types/common'

export interface IApplicationSingletoneFacade {
    executeTransactsionById(id: string): void
    deleteRequirement(
        reqId: string,
        authToken:string ,
    ): Promise<Pick<IRequirementStats, 'id'> | null>
    addRequirement(
        stats: Omit<
            IRrequirementsStatsType,
            | 'id'
            | 'userId'
            | 'createdTimeStamp'
            | 'updatedTimeStamp'
            | 'deleted'
            | 'executed'
        >
    ): Promise<any>
    addRequirementSchedule(
        task: ITask<ITransactionRequirementCommand, IPerson>
    ): void
    createUserRemote(
        userName: string,
        password: string,
        createUserService: ICreateUserService
    ): Promise<ICreateUserResponseData>
    getLocalUserStats(): IPerson | null
    getUserStats():
        | (Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
              requirements: Omit<
                  IRrequirementsStatsType,
                  'userId' | 'deleted'
              >[]
          })
        | null
    userLogIn(userName: string, password: string): Promise<IPerson | null>
    userLogOut(): any
    onAppUpdate(cb: () => void): void
    onUserSet(
        cb: (
            user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
                requirements: Omit<
                    IRrequirementsStatsType,
                    'userId' | 'deleted'
                >[]
            }
        ) => void
    ): any
    onUserUpdate(cb: () => any): any
    subscriberOnMessage({
        callBacks,
        message,
    }: {
        message: string
        callBacks: (() => void)[]
        executedTimeStamp: number
    }): void
    // emitMessage(message: string): void
}

export interface IResponseData<T> {
    payload: T | null
    status: {
        code: number
        details: string
    }
}

export interface ICreateUserResponseData
    extends IResponseData<{
        userId: string
    }> {}

export interface IAuthUserResponseData extends ICreateUserResponseData {}

// в токене кодируется userId
export interface ICheckAuthTokenResponseData {
    token: string
}

export class ApplicationSingletoneFacade
    implements IApplicationSingletoneFacade
{
    executeTransactsionById(id: string): void {
        const user = this.user

        if (user === null) {
            // this.browserLocalStorageManagementService.unsetAuthData()

            console.log('>>> inline log >>> user is null');
            // #warning // #todo onUserIsNull is not provided

            return
        }

        console.log('>>> executeTransaction :: getting requirements...')
        const requirements = user.getAllReauirementCommands().filter((elem) => {
            return elem.getId() === id
        })

        if (requirements.length > 1)
            throw new Error('multiple items by Id: ' + id)

        if (requirements.length < 1)
            throw new Error('no transactions by Id: ' + id)

        const requirement = requirements[0]

        requirement.execute(user)

        console.log('>>> executeTransaction :: ', requirements)
        console.log('>>> executeTransaction :: user has been mutated')
    }

    async addRequirement(
        stats: Omit<
            IRrequirementsStatsType,
            | 'id'
            | 'userId'
            | 'createdTimeStamp'
            | 'updatedTimeStamp'
            | 'deleted'
            | 'executed'
            > & {authToken:string}
    ): Promise<any> {
        const authToken = stats.authToken; //  #warning
            // this.browserLocalStorageManagementService.getAuthData()
        if (authToken) {
            const data =
                await this.requriementManagementService.createRequirement(
                    stats,
                    authToken
                )

            console.log('>>> create requirement :: response: ', data)

            if (data.payload === null) {
                return null
            }

            const newUser = this.personFactory.create(
                data.payload.name,
                data.payload.wallet,
                data.payload.createdTimeStamp,
                data.payload.updatedTimeStamp
            )

            if (newUser) {
                data.payload.requirements.forEach((requirement) => {
                    const newRequirement = new RequirementFactory().create({
                        ...requirement,
                    })

                    if (newRequirement) {
                        newUser.addRequirementCommand(newRequirement)
                    }
                })

                this.setUserLocally(newUser)
            }
        }
    }

    async deleteRequirement(
        reqId: string,
        authToken:string ,
    ): Promise<Pick<IRequirementStats, 'id'> | null> {
        const log = loggerCreator(
            true
            // && false
        )

        log('try delete the requirement')
        log('req id: ' + reqId)
        const authData = authToken; // warning
            // this.browserLocalStorageManagementService.getAuthData()

        if (authData === null) {
            log('localstorage failed')
            return null
        }

        log('local storage: ' + authData)

        const response =
            await this.requriementManagementService.deleteRequirement(
                reqId,
                authData,
                this.authUserService
            )

        if (response.payload === null) {
            log('payload failed')
            return null
        }

        log('payload: ' + response.payload.requirementId)

        return { id: response.payload.requirementId }
    }

    async userLogIn(
        userName: string,
        password: string
    ): Promise<IPerson | null> {
        const log = loggerCreator(true, 'USER LOGGING')

        log('user loging')
        log(userName + ' | ' + password)

        const logInResponse =
            await this.HTTPServerComunicateService.getUserByUserNameAndPassword(
                userName,
                password
            )

        if (logInResponse.payload === null) {
            return null
        }

        const { name, wallet, requirements } = logInResponse.payload.userStats

        const createdTimeStamp =
            logInResponse.payload.userStats.createdTimeStamp
        const updatedTimeStamp =
            logInResponse.payload.userStats.updatedTimeStamp

        const newPerson = this.personFactory.create(
            name,
            wallet,
            createdTimeStamp,
            updatedTimeStamp
        )

        for (const requirement of requirements) {
            const createdReauirement = this.requirementFactory.create({
                ...requirement,
            })

            if (createdReauirement === null) continue

            newPerson.addRequirementCommand(createdReauirement)
        }

        this.setUserLocally(newPerson)

        const token = logInResponse.payload.authToken

        // this.browserLocalStorageManagementService.setAuthData(token)
        // #warning implement addEventListener

        return newPerson
    }

    userLogOut() {
        this.unsetUser()
        return true
    }

    onUserIsUnset(cb: () => any) {
        this.userUnsetCallBackPull.push(cb)
    }

    onUserUpdate(cb: () => any) {}

    onAppUpdate(cb: () => void): void {
        this.callbackPull.push(cb)
    }

    onUserSet(
        cb: (
            user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
                requirements: Omit<
                    IRrequirementsStatsType,
                    'userId' | 'deleted'
                >[]
            }
        ) => void
    ): any {
        this.userIsSetCallBackPull.push(cb)
    }

    getLocalUserStats(): IPerson | null {
        if (this.user === null) {
            return null
        }

        return this.user
    }

    getUserStats():
        | (Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
              requirements: Omit<
                  IRrequirementsStatsType,
                  'userId' | 'deleted'
              >[]
          })
        | null {
        if (this.user === null) {
            return null
        }

        const stats: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
            requirements: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>[]
        } = {
            createdTimeStamp: this.user.getCreatedTimeStamp(),
            updatedTimeStamp: this.user.getUpdatedTimeStamp(),
            name: this.user.getName(),
            wallet: this.user.getWalletBalance(),
            requirements: this.user
                .getAllReauirementCommands()
                .map<
                    Omit<IRrequirementsStatsType, 'deleted' | 'userId'>
                >((transactinRequirement) => ({
                    createdTimeStamp:
                        transactinRequirement.getCreatedTimeStamp(),
                    updatedTimeStamp:
                        transactinRequirement.getUpdatedTimeStamp(),
                    transactionTypeCode:
                        transactinRequirement.getTransactionTypeCode(),
                    dateToExecute: transactinRequirement.getDateToExecute(),
                    deleted: transactinRequirement.getDeletedTheState(),
                    description: transactinRequirement.getDescription(),
                    id: transactinRequirement.getId(),
                    executed: transactinRequirement.isExecuted(),
                    title: transactinRequirement.getTitle(),
                    value: transactinRequirement.getValue(),
                })),
        }

        return stats
    }

    async createUserRemote(
        userName: string,
        password: string,
        createUserService: ICreateUserService
    ): Promise<ICreateUserResponseData> {
        return createUserService.execute(userName, password)
    }

    subscriberOnMessage({
        callBacks,
        message,
    }: {
        message: string
        callBacks: (() => void)[]
    }): void {
        this.subscribers.push({ callBacks, message, executedTimeStamp: 0 })
    }

    private emitMessage(message: string): void {
        this.subscribers.forEach((subscriber) => {
            if (subscriber.message === message) {
                subscriber.callBacks.forEach((callBack) => {
                    callBack()
                })
            }
        })
    }

    private setUserLocally(user: IPerson): void {
        this.user = user

        // ---------

        user.on('requirement-updated', [
            () => this.emitMessage('updated'),
            () => {
                const userStats = this.getUserStats()

                console.log('>>> get user stats response ::: ', userStats)

                if (userStats === null) {
                    return
                }

                const user = this.user

                if (user === null) return

                const transactionsStatsArr: Omit<
                    IRrequirementsStatsType,
                    'userId' | 'deleted'
                >[] = user.removeTransactionsToSyncAsStats()

                userStats.requirements = transactionsStatsArr

                console.log('>>> set user locally ::: userStats:', userStats)

                this.HTTPServerComunicateService.pushUserDataStats(
                    userStats,
                    '' , // #warning auth token is not provided
                )
                    .then((response) => {
                        if (response.payload === null) return

                        const newUser = this.personFactory.create(
                            response.payload.name,
                            response.payload.wallet,
                            response.payload.createdTimeStamp,
                            response.payload.updatedTimeStamp
                        )

                        // const newRequirmentsPool:ITransactionRequirementCommand[] = []

                        console.log(
                            '>>> response payload requirements >>> ',
                            response.payload.requirements
                        )

                        response.payload.requirements.forEach((elem) => {
                            const transaction = this.requirementFactory.create({
                                ...elem,
                            })

                            console.log(
                                '>>> new transaction >>> data ::: ',
                                transaction
                            )
                            if (transaction !== null) {
                                // newRequirmentsPool.push(transaction);
                                newUser.addRequirementCommand(transaction)
                            }
                        })

                        this.setUserLocally(newUser)
                    })
                    .catch((e) => {
                        alert(e)
                    })
            },
        ])

        this.user.onUpdate((user: IPerson) => {})

        this.userIsSetCallBackPull.forEach((callBack) => {
            const userData = this.getUserStats()
            if (userData) {
                callBack(userData)
            }
        })
    }

    static Instance(
        // localStorageService: ILocalStorageManagementService,
        serverConnector: IHTTPServerCommunicateService,
        eventService: IEventService,
        authToken:string ,
    ) {
        if (ApplicationSingletoneFacade.instance === null) {
            ApplicationSingletoneFacade.instance =
                new ApplicationSingletoneFacade(
                    // localStorageService,
                    // serverConnector,
                    // eventService,
                    authToken,
                )
        }

        return ApplicationSingletoneFacade.instance
    }

    addRequirementSchedule(
        task: ITask<ITransactionRequirementCommand, IPerson>
    ) {}

    private subscribers: {
        message: string
        callBacks: (() => void)[]
        executedTimeStamp: number
    }[]
    // private browserLocalStorageManagementService: ILocalStorageManagementService
    private requriementManagementService: IRequirementManagementService
    private authUserService: IAuthService
    private updatingStatus: boolean
    private personFactory: PersonFactory
    private requirementFactory: IRequirementFactory

    private user: IPerson | null
    private static instance: ApplicationSingletoneFacade | null = null
    private eventServise: IEventService
    private HTTPServerComunicateService: IHTTPServerCommunicateService
    private callbackPull: (() => void)[]
    private userIsSetCallBackPull: ((
        user: Omit<IUserStats, 'id' | 'requirements' | 'password'> & {
            requirements: Omit<
                IRrequirementsStatsType,
                'userId' | 'password' | 'deleted'
            >[]
        }
    ) => any)[]
    private userUnsetCallBackPull: (() => any)[]

    private updateRequirements(): void {}

    private unsetUser(): void {
        // this.browserLocalStorageManagementService.unsetAuthData()
        // #warning 

        this.user = null

        this.userUnsetCallBackPull.forEach((callback) => {
            callback()
        })
    }

    /* private  */ constructor(
        // localStorageService: ILocalStorageManagementService,
        // serverConnector: IHTTPServerCommunicateService,
        // eventService: IEventService,
        authToken:string ,
    ) {
        // subscribers

        this.subscribers = []

        // observer pulls

        this.userIsSetCallBackPull = []
        this.userUnsetCallBackPull = []

        // --

        
        
        this.HTTPServerComunicateService = new HTTPServerComunicateService();
        this.authUserService = new AuthUserService()
        this.eventServise = new EventService();
        this.personFactory = new PersonFactory()
        this.requirementFactory = new RequirementFactory()
        this.requriementManagementService = new RequrementManagementService(
            new RequirementFactory()
        )

        this.callbackPull = []
        this.updatingStatus = false
        // this.browserLocalStorageManagementService = localStorageService

        this.user = null

        const authData = authToken;
            // this.browserLocalStorageManagementService.getAuthData()
            // #warning
        
        ;(async (
            serverCommunicator: IHTTPServerCommunicateService,
            // localstorageServ: ILocalStorageManagementService,
            personFactory: IPersonFacory,
            reqFactory: IRequirementFactory
        ) => {
            if (authData) {
                this.updatingStatus = true

                const response =
                    await serverCommunicator.getUserByAuthToken(authData)

                const responsedPayload = response.payload

                if (responsedPayload === null) {
                    return
                }

                // localstorageServ.setAuthData(responsedPayload.authToken) 
                // #warning

                const user = personFactory.create(
                    responsedPayload.userStats.name,
                    responsedPayload.userStats.wallet,
                    responsedPayload.userStats.createdTimeStamp,
                    responsedPayload.userStats.updatedTimeStamp
                )

                console.log('>>> server-connector :: created user', user)

                responsedPayload.userStats.requirements.forEach((elem) => {
                    const requirementInitData: Omit<
                        IRrequirementsStatsType,
                        'userId' | 'deleted'
                    > = elem

                    const createdRequirement =
                        reqFactory.create(requirementInitData)

                    if (createdRequirement !== null) {
                        user.addRequirementCommand(createdRequirement)
                    }
                })

                this.setUserLocally(user)

                const log__user = this.getUserStats()

                console.log(
                    '>>> app constructor ::  user name: ' + log__user?.name
                )
            }
        })(
            this.HTTPServerComunicateService,
            // this.browserLocalStorageManagementService,
            this.personFactory,
            this.requirementFactory
        )

        // this.createUser()
    }
}

