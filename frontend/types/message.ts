import type { ChatUser } from "./user";

export type ChatMessage = {
  id?: string;
  user: ChatUser;
  message: string;
  createdAt: Date | string;
  roomId?: string;
};

export type SendMessagePayload = {
  message: string;
  roomId: string;
};
