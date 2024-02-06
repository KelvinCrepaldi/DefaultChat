"use client";
import {
  ActiveChatContext,
  activeChatContextType,
} from "@/contexts/activeChatsContext";
import { IListActiveChats } from "@/interfaces/activeChats";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";

const ChatList = () => {
  const { chatList, fetchChatList } = useContext(
    ActiveChatContext
  ) as activeChatContextType;
  const { data: session } = useSession();

  useEffect(() => {
    if (session) fetchChatList();
  }, [session]);

  return (
    <section>
      {chatList?.map((chat: IListActiveChats) => (
        <ChatCard user={chat.user} id={chat.id} key={chat.id} />
      ))}
    </section>
  );
};

const ChatCard = ({ user, id }: IListActiveChats) => {
  const pathname = usePathname()?.split("/")[3];

  const { push } = useRouter();
  const { closeChat } = useContext(ActiveChatContext) as activeChatContextType;

  const goToChat = () => {
    push(`/me/chat/${user.id}`);
  };

  const handleCloseChat = (e: any) => {
    e.stopPropagation();
    closeChat(id);
  };

  return (
    <div className="relative group cursor-pointer" onClick={goToChat}>
      <div
        className={`rounded-l-full p-2 flex gap-3 items-center  ${
          pathname
            ? "bg-chatBackground2"
            : "bg-chatBackground0 hover:bg-chatBackground1"
        }`}
        key={user.id}
      >
        <Image
          src={user.image}
          className="rounded-full w-[40px] h-[40px] object-cover bg-black"
          width={60}
          height={60}
          alt="User profile image"
        ></Image>
        <div className="flex justify-between items-center shrink w-full ">
          <div className="truncate ... max-w-[150px] text-chatCardHover">
            <span className="text-lg text-chatTitle font-semibold  ">
              {user.name}asdfasdfasdfasdfasdf
            </span>
          </div>

          <button
            onClick={handleCloseChat}
            className="pr-3 rounded-full opacity-0 group-hover:opacity-100 text-chatTextWhite hover:text-chatBackground0 "
          >
            <FaXmark />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
