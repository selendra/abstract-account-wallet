import { UserOperation } from "../../core-types";
import { UserOpResponse } from "../../bundler";
export interface ISmartAccount {
  getSmartAccountAddress(_accountIndex: number): Promise<string>;
  signUserOp(_userOp: UserOperation): Promise<UserOperation>;
  sendUserOp(_userOp: UserOperation): Promise<UserOpResponse>;
  sendSignedUserOp(_userOp: UserOperation): Promise<UserOpResponse>;
}