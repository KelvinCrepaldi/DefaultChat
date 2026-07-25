import type { ChatMessage } from "./message";
import type { UserSummary } from "./user";

export type PrivateRoom = {
  id: string;
  name: string;
  image: string;
  user: UserSummary;
  notification: number;
  status: string;
  messages: ChatMessage[];
};

export type GroupRoom = {
  id: string;
  name: string;
  image: string | null;
  users: UserSummary[];
  notification: number;
  messages: ChatMessage[];
};

export type PrivateRoomApi = {
  id: string;
  name: string;
  image: string;
  user: UserSummary;
  notifications?: number;
  notification?: number;
  messages: ChatMessage[];
};

export type GroupRoomApi = {
  id: string;
  name: string;
  image: string | null;
  users: UserSummary[];
  messages: ChatMessage[];
  notification: number;
};

export type GroupListItem = {
  id: string;
  name: string;
  image: string | null;
  memberCount: number;
  isMember?: boolean;
};

export type CreateGroupResponse = {
  id: string;
  name: string;
  image: string | null;
  type: string;
  memberCount: number;
};

export type RoomListResponse = {
  privateRooms: PrivateRoomApi[];
  groupRooms: GroupRoomApi[];
};

/** @deprecated Prefer PrivateRoom — kept for existing imports */
export type IPrivateRoom = PrivateRoom;
/** @deprecated Prefer GroupRoom */
export type IGroupRoom = GroupRoom;
