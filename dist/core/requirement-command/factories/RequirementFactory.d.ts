import { IRrequirementsStatsType } from '../interfaces';
import { ITransactionRequirementCommand } from '../RequirementCommand';
export interface IRequirementFactory {
    create({ id, value, title, description, dateToExecute, transactionTypeCode, executed, createdTimeStamp, updatedTimeStamp, }: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>): ITransactionRequirementCommand | null;
}
export declare class RequirementFactory implements IRequirementFactory {
    create({ id, value, title, description, dateToExecute, transactionTypeCode, executed, createdTimeStamp, updatedTimeStamp, }: Omit<IRrequirementsStatsType, 'userId' | 'deleted'>): ITransactionRequirementCommand | null;
    constructor();
}
