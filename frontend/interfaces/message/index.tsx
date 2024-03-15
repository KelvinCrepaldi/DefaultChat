export interface ISendMessage {
  message: string,
  user: {
    id: string;
    name: string,
    image: string
  },
  roomId: string
}

export interface IMessage {
  id: string;
  message: string,
  user: {
    id: string,
    name: string,
    image: string
  },
  createdAt: Date
}
