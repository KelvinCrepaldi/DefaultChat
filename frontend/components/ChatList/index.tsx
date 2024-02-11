"use client";
import {
  ActiveChatContext,
  activeChatContextType,
} from "@/contexts/activeChatsContext";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { IRoom, SocketContext } from "@/contexts/socketContext";

const ChatList = () => {
  const { data: session } = useSession();

  const { rooms } = useContext(
    SocketContext
  );

  useEffect(() => {
    if (session) {}
  }, [session]);

  return (
    <section>
      {rooms?.map((room: IRoom)=><ChatCard room={room} key={room.id} />)}   
    </section>
  );
};

type ChatCardProps = {
  room: IRoom,
}

const ChatCard = ({ room }: ChatCardProps) => {
  const pathname = usePathname()?.split("/")[3];

  const { push } = useRouter();
  const { closeChat } = useContext(ActiveChatContext) as activeChatContextType;

  const goToChat = () => {
    push(`/me/chat/${room.id}`);
  };

  const handleCloseChat = (e: any) => {
    e.stopPropagation();
    closeChat(room.id);
  };

  return (
    <div className="relative group cursor-pointer" onClick={goToChat}>
      <div
        className={`rounded-l-full p-2 flex gap-3 items-center  ${
          pathname
            ? "bg-chatBackground2"
            : "bg-chatBackground0 hover:bg-chatBackground1"
        }`}
        key={room.id}
      >
        <Image
          src={room.user.image}
          className="rounded-full w-[40px] h-[40px] object-cover bg-black"
          width={60}
          height={60}
          alt="User profile image"
        ></Image>
        <div className="flex justify-between items-center shrink w-full ">
          <div className="truncate ... max-w-[150px] text-chatCardHover">
            <span className="text-lg text-chatTitle font-semibold  ">
              {room.user.name} {room.status === "online" ? "on" : "off"}
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
