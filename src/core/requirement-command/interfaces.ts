export interface IRequirementStats {
  cashFlowDirectionCode: number;
  dateToExecute: number;
  description: string;
  executed: boolean;
  title: string;
  userId: string;
  value: number;
  id: string;
  deleted: boolean;
}

export interface IRrequirementsStatsType {
  createdTimeStamp: number;
  updatedTimeStamp: number;
  dateToExecute: number;
  description: string;
  transactionTypeCode: number;
  id: string;
  userId: string;
  title: string;
  value: number;
  deleted: boolean;
  executed: null | {
    executedTimeStamp: number;
  };
}
