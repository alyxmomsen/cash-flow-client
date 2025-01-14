
import { getServerBaseUrl } from '../../core-utils/core-utils'
import { IUserStats, TFetchResponse } from '../types/common'

export interface IGetUserService {
    byId(id: string): Promise<TFetchResponse<Omit<IUserStats, 'id'>>>
}

export class GetUserService implements IGetUserService {
    async byId(id: string): Promise<TFetchResponse<Omit<IUserStats, 'id'>>> {
        const response = await fetch(getServerBaseUrl() + '/get-user-protected', {
            headers: {
                'content-type': 'application/json',
                'x-auth': id,
            },
            method: 'post',
        })

        const data = (await response.json()) as TFetchResponse<
            Omit<IUserStats, 'id'>
        >

        // const { payload, status } = data

        return data
    }
}
