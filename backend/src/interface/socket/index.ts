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
  userEmail:string
}

export interface IUserRegisterSocket {
  userEmail: string;
}

export interface IUserReadySocket {
  userEmail: string;
  activeRooms: string[]
}

export interface IUserJoinRoomSocket {
  room: string;
}