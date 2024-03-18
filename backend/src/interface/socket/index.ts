interface IUser{
  id: string;
  name: string,
  image: string
}

export interface IClientMessage{
  message: string,
  user: IUser,
  roomId: string
}

export interface IUsersOnline {
  socketId: string,
  userId: string,
}

export interface IUserRegisterSocket {
  userId: string;
}

export interface IUserReadySocket {
  userId: string;
  activeRooms: string[]
}

export interface IUserJoinRoomSocket {
  room: string;
}