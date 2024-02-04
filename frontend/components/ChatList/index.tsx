"use client";
import {
  ActiveChatContext,
  activeChatContextType,
} from "@/contexts/activeChatsContext";
import { IListActiveChats } from "@/interfaces/activeChats";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import UserCard from "../_ui/UserCard";
import { useRouter } from "next/navigation";

const ChatList = () => {
  const router = useRouter();
  const { chatList, fetchChatList } = useContext(
    ActiveChatContext
  ) as activeChatContextType;
  const { data: session } = useSession();

  useEffect(() => {
    if (session) fetchChatList();
  }, [session]);

  const goToChat = (id: string) => {
    router.push(`/me/chat/${id}`);
  };

  return (
    <section>
      {chatList.map((chat: IListActiveChats) => (
        <div key={chat.id} onClick={() => goToChat(chat.friend.id)}>
          <UserCard user={chat.friend} />
        </div>
      ))}
    </section>
  );
};

export default ChatList;
