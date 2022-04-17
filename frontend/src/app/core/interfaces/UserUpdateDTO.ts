import { WorkloadCalculateMethod } from './LoadingStatusSnapshotDTO'

export interface UserUpdateDTO {
  email?: string;
  acuteRange?: number;
  chronicRange?: number;
  calculationMethod?: WorkloadCalculateMethod;
}
