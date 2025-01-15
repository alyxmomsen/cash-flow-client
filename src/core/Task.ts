import { IPerson } from "./person/Person";
import { ITransactionRequirementCommand } from "./requirement-command/RequirementCommand";

export interface ITask<T, S> {
  getRequirement(): ITransactionRequirementCommand;
  getDateStart(): Date;
}

export class RequirementTask
  implements ITask<ITransactionRequirementCommand, IPerson>
{
  dateStart: Date;
  requirement: ITransactionRequirementCommand;

  getRequirement(): ITransactionRequirementCommand {
    return this.requirement;
  }
  getDateStart(): Date {
    return this.dateStart;
  }
  constructor(dateStart: Date, requirement: ITransactionRequirementCommand) {
    this.dateStart = dateStart;
    this.requirement = requirement;
  }
}
