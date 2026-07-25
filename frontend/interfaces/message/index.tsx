import type { ChatMessage, SendMessagePayload } from "@/types/message";
import type { UserSummary } from "@/types/user";

export type { ChatMessage, SendMessagePayload };

export interface ISendMessage extends SendMessagePayload {
  user?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface IMessage {
  id: string;
  message: string;
  user: Pick<UserSummary, "id" | "name" | "image">;
  createdAt: Date;
}
