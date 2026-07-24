import { IUserAuthResponse } from "./userAuth.interface";

export interface IloginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse extends IUserAuthResponse {}
