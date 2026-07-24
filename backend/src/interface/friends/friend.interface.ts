export interface IFriend {
  id: string
  name: string
  email: string
}
export interface IListFriendsResponse {
  id: string
  friend: IFriend
}

export interface IListFriendsRequest {
  userId: string
}

export interface FriendRequestsResponse {
  id: string
  user: IUser
}

interface IUser {
  id: string
  name: string
}

export interface IAcceptFriendRequest {
  requestId: string;
  userId: string;
}

export interface IAcceptFriendResponse {
  message: string
}

export interface IDeclineFriendsRequest {
  requestId: string;
   userId: string;
}

export interface IDeclineFriendsResponse {
  message: string
}

export interface IDeleteFriendRequest {
  userId: string;
  friendId: string;
}

export interface IDeleteFriendResponse { 
  message: string 
}