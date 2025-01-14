import { IPerson } from '../Person'

export interface IPersonObserver {
    execute(user: IPerson): any
    addObserveable(cb: (user: IPerson) => any): any
}

export class PersonObserver implements IPersonObserver {
    private observeables: {
        executed: boolean
        subject: (user: IPerson) => any
    }[]

    addObserveable(cb: (user: IPerson) => any): any {
        this.observeables.push({ executed: false, subject: cb })
    }

    execute(user: IPerson): any {
        this.observeables.forEach((elem) => {
            if (!elem.executed) {
                elem.subject(user)
                elem.executed = true
            }
        })
    }

    constructor() {
        this.observeables = []
    }
}
