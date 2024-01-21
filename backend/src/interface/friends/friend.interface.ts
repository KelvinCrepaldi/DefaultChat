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
  user: {
    id: string
    name: string
  }
}
