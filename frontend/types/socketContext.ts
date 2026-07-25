import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { SendMessagePayload } from "@/types/message";
import type {
  CreateGroupResponse,
  GroupListItem,
  GroupRoom,
  PrivateRoom,
} from "@/types/room";

export type SocketContextValue = {
  scrollToBottom: () => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  isConnected: boolean;
  socket: Socket;
  error: IErrorResponse | null;
  privateRooms: PrivateRoom[];
  groupRooms: GroupRoom[];
  listRef: MutableRefObject<HTMLUListElement | null>;
  fetchMessage: (payload: { roomId: string }) => Promise<void>;
  closeRoom: (payload: { roomId: string }) => Promise<void>;
  fetchChatList: () => Promise<void>;
  openRoom: (payload: { userId: string }) => Promise<void>;
  openGroupRoom: (payload: { roomId: string }) => Promise<void>;
  createGroup: (payload: { name: string }) => Promise<CreateGroupResponse | null>;
  joinGroup: (payload: { roomId: string }) => Promise<GroupRoom | null>;
  listGroups: () => Promise<GroupListItem[]>;
  searchGroups: (payload: { letters: string }) => Promise<GroupListItem[]>;
  setPrivateRooms: Dispatch<SetStateAction<PrivateRoom[]>>;
  setGroupRooms: Dispatch<SetStateAction<GroupRoom[]>>;
  resetPrivateNotificationCount: (payload: { roomId: string }) => void;
};
