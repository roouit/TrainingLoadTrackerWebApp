export enum WorkloadCalculateMethod {
  RollingAverage,
  ExponentiallyWeightedMovingAverage,
}

export interface LoadSummaryDTO {
  method: WorkloadCalculateMethod;
  acute: number;
  chronic: number;
  ratio: number;
}
