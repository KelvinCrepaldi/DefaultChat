import type { UserSummary } from "@/types/user";

export type { UserSummary };

export interface IFriend {
  id: string;
  createdAt: string;
  type: string;
  addressee: UserSummary;
}

export interface IUser extends UserSummary {
  picture?: string;
}

export interface IListFriendsResponse {
  id: string;
  friend: IFriend;
}

export interface IListFriendsRequest {
  userId: string;
}

export type FriendRequest = {
  id: string;
  createdAt: string;
  type: string;
  requester: UserSummary;
};

/** @deprecated Prefer FriendRequest — API returns requester */
export interface IFriendRequestsResponse {
  id: string;
  user: UserSummary;
  requester?: UserSummary;
}
