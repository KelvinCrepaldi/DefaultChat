export interface IListActiveChats {
  id: string;
  roomId: string;
  friend: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}
