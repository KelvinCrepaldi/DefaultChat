export interface IPrivateRoom {
  id: string,
  name: string,
  image: string,
  user: IUser,
  messages: any
}

interface IUser{
  id: string,
  name: string,
  email: string,
  image: string,
}