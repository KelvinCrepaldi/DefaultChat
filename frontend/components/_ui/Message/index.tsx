'use client'
import type { ChatMessage } from "@/types/message";
import formatDate from "@/utils/formatDate";
import { useSession } from "next-auth/react";
import UserAvatar from "../UserAvatar";

const Message = ({ msg }: { msg: ChatMessage }) => {
  const {data: session} = useSession();
  return (
    <div className={`p-1 m-[2px] shadow rounded text-chatTextWhite flex w-full
    ${session?.user.name === msg.user.name ? "bg-chatMessageBox1" : "bg-chatMessageBox2"}`}>
      <div className="m-1 mr-4">
        <UserAvatar name={msg.user.name} image={msg.user.image} size={30} />
      </div>
      <div className="flex-col w-full mb-2">
        <div className="flex items-center justify-between">
          <p className="text-chatTitle">{msg.user.name}</p>
          <p className="opacity-40">{formatDate(msg.createdAt) }</p>
        </div>
        <div className="w-full border-b opacity-5 mb-1"></div>
        <div>
          <p>{msg.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
