export interface IListMessagesService {
  roomId: string;
}

export interface IListMessageServiceResponse {
  message: string,
      user: IUser,
      createdAt: Date
}

interface IUser {
  id: string,
  name: string,
  image: string
}
