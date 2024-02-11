import { IUser } from "../friends";
export interface ISendMessage {
  user: IUser;
  message: string;
  roomId: string;
}

export interface IReceiveMessage {
  user: IUser;
  message: string;
  createdAt: Date;
}
