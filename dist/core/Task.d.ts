import { IPerson } from './person/Person';
import { ITransactionRequirementCommand } from './requirement-command/RequirementCommand';
export interface ITask<T, S> {
    getRequirement(): ITransactionRequirementCommand;
    getDateStart(): Date;
}
export declare class RequirementTask implements ITask<ITransactionRequirementCommand, IPerson> {
    dateStart: Date;
    requirement: ITransactionRequirementCommand;
    getRequirement(): ITransactionRequirementCommand;
    getDateStart(): Date;
    constructor(dateStart: Date, requirement: ITransactionRequirementCommand);
}
