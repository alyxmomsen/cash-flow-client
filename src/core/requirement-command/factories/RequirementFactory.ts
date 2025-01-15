import { IRequirementStats, IRrequirementsStatsType } from "../interfaces";
import {
  DecrementMoneyRequirementCommand,
  IncrementMoneyRequirementCommand,
  ITransactionRequirementCommand,
} from "../RequirementCommand";

export interface IRequirementFactory {
  create({
    id,
    value,
    title,
    description,
    dateToExecute,
    transactionTypeCode,
    executed,
    createdTimeStamp,
    updatedTimeStamp,
  }: Omit<
    IRrequirementsStatsType,
    "userId" | "deleted"
  >): ITransactionRequirementCommand | null;
}

export class RequirementFactory implements IRequirementFactory {
  create({
    id,
    value,
    title,
    description,
    dateToExecute,
    transactionTypeCode,
    executed,
    createdTimeStamp,
    updatedTimeStamp,
  }: Omit<
    IRrequirementsStatsType,
    "userId" | "deleted"
  >): ITransactionRequirementCommand | null {
    switch (transactionTypeCode) {
      case 0:
        return new IncrementMoneyRequirementCommand({
          id,
          value,
          title,
          description,
          dateToExecute,
          executed,
          createdTimeStamp,
          updatedTimeStamp,
        });
        break;
      case 1:
        return new DecrementMoneyRequirementCommand({
          id,
          value,
          title,
          description,
          dateToExecute,
          executed,
          createdTimeStamp,
          updatedTimeStamp,
        });
        break;

      default:
        return null;
        break;
    }
  }

  constructor() {}
}
