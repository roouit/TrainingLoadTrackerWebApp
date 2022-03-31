export enum WorkloadCalculateMethod {
  RollingAverage,
  ExponentiallyWeightedMovingAverage,
}

export interface LoadingStatusSnapshotDTO {
  method: WorkloadCalculateMethod;
  acute: number;
  chronic: number;
  ratio: number;
  snapshotDate: Date;
  dailyLoad: number;
}
