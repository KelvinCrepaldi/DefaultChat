import { IUserAuthResponse } from "./userAuth.interface";

export interface ISignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ISignupResponse extends IUserAuthResponse {}
