'use client'
import { socketMessage } from "@/contexts/socketContext";
import { IMessage } from "@/interfaces/message";
import formatDate from "@/utils/formatDate";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Message = ({ msg }: { msg: IMessage }) => {
  const {data: session} = useSession();
  return (
    <div className={`p-1 m-[2px] shadow rounded text-chatTextWhite flex ${session?.user.name === msg.user.name ? "bg-chatMessageBox1" : "bg-chatMessageBox2"}`}>
      <Image
        src={msg.user.image || ""}
        className="rounded-full w-[30px] h-[30px] object-cover bg-black m-1 mr-4"
        width={40}
        height={40}
        alt="User profile image"
      ></Image>
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
