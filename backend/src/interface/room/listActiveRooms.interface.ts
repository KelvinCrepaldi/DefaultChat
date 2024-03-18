interface IUser{
  id: string
  name: string,
  email: string,
  image:string,
}

export interface IListActiveRooms {
  userId: string;
}

export interface IPrivateRoom {
  id: string,
  name: string,
  image: string,
  user: IUser,
  messages: any[],
  notification: number;
} 

export interface IGroupRoom{ 
  id: string,
  name: string,
  image: string,
  users: IUser[],
}

export interface IListActiveRoomsResponse{
  privateRooms: IPrivateRoom[],
  groupRooms:IGroupRoom[],
}