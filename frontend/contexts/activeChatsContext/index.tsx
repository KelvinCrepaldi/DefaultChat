"use client";
import { IListActiveChats } from "@/interfaces/activeChats";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";

export type activeChatContextType = {
  chatList: IListActiveChats[];
  fetchChatList: () => void;
  closeChat: (id: string) => void;
};

export const ActiveChatContext = createContext<activeChatContextType | null>(
  null
);

interface IUsersList {
  user: string
  messages: IListActiveChats[]
  ping: number
}

export const ActiveChatProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const [chatList, setChatList] = useState<IListActiveChats[]>([]);
  const { data: session } = useSession();
  const [channels, setChannels] = useState<IUsersList[]>([]);

  const fetchChatList = async () => {
    try {
      const response = await api.get("/api/room/list", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });

      const data = response.data;
      
      
      setChatList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeChat = async (id: string) => {
    try {
      const removeChat = chatList.filter((chat) => chat.id !== id);
      setChatList(removeChat);
      await api.post(
        `/api/room/${id}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.user.accessToken}` },
        }
      );

      push("/me/friends");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ActiveChatContext.Provider value={{ chatList, fetchChatList, closeChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
};
