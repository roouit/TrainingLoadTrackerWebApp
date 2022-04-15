import { WorkloadCalculateMethod } from './LoadingStatusSnapshotDTO'

export interface UserRegisterDTO {
  password: string;
  email: string;
  acuteRange: number;
  chronicRange: number;
  calculationMethod: WorkloadCalculateMethod;
}
