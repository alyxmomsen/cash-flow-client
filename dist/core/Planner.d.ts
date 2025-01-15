import { IPerson } from "./person/Person";
import { ITransactionRequirementCommand } from "./requirement-command/RequirementCommand";
import { ITask } from "./Task";
export interface IPlanner<T, S> {
    addTask(task: ITask<T, S>): ITask<T, S>;
    check(): void;
}
export declare class RequirementPlanner implements IPlanner<ITransactionRequirementCommand, IPerson> {
    private tasks;
    private subject;
    addTask(task: ITask<ITransactionRequirementCommand, IPerson>): ITask<ITransactionRequirementCommand, IPerson>;
    check(): void;
    constructor(person: IPerson);
}
