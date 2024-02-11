export interface IClientMessage{
  user: {
    id?: string;
    name: string;
    email: string;
    image:string;
  };
  message: string;
  roomId: string;
}