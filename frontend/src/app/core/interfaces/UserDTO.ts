import { WorkloadCalculateMethod } from "./LoadingStatusSnapshotDTO";

export interface UserDTO {
  email: string;
  acuteRange: number;
  chronicRange: number;
  calculationMethod: WorkloadCalculateMethod
}
