"use client";
import { IListActiveChats } from "@/interfaces/activeChats";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useState } from "react";

export type activeChatContextType = {
  chatList: IListActiveChats[];
  fetchChatList: () => void;
};

export const ActiveChatContext = createContext<activeChatContextType | null>(
  null
);

export const ActiveChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatList, setChatList] = useState<IListActiveChats[]>([]);
  const { data: session } = useSession();

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

  return (
    <ActiveChatContext.Provider value={{ chatList, fetchChatList }}>
      {children}
    </ActiveChatContext.Provider>
  );
};
