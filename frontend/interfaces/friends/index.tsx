export interface IFriend {
  id: string;
  createdAt: string;
  type: string;
  addressee: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  image: string;
  picture?: string;
}
export interface IListFriendsResponse {
  id: string;
  friend: IFriend;
}

export interface IListFriendsRequest {
  userId: string;
}

export interface IFriendRequestsResponse {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}
