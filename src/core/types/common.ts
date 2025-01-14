import { IRrequirementsStatsType } from '../requirement-command/interfaces'

export interface IUserStats {
    name: string
    wallet: number
    id: string
    requirements: Omit<IRrequirementsStatsType, 'userId'>[]
    createdTimeStamp: number
    updatedTimeStamp: number
    password: string
}

export type TStatus = {
    id: number
    title: string
}

export type TWalletTrackValue = {
    valueAfter: number
    valueBefore: number
    value: number
    executionDate: number
    transactionTypeCode: number
}

export type TFetchUserData = {
    userName: string
    wallet: number
}

// export type TFetchUserRequirements

export type TUserRequirementStats = {
    id: string
    title: string
    value: number
    description: string
    date: number
    isExecuted: boolean
    transactionTypeCode: number
}

export type TFetchAuthResponseData = {
    userId: string
}

export type TFetchResponse<T> = {
    status: {
        code: number
        details: string
    }
    payload: T | null
}