'use client'
import { socketMessage } from "@/contexts/socketContext";
import { IMessage } from "@/interfaces/message";
import formatDate from "@/utils/formatDate";
import { useSession } from "next-auth/react";
import Image from "next/image";

type MessageProps = {
  createdAt: "2024-02-13T02:14:17.314Z"
  id: "cce54b9f-af9c-47ca-bed7-11f9f9bea395"
  message: "sdf"
  room: any
}

const Message = ({ msg }: { msg: IMessage }) => {
  const {data: session} = useSession();
  return (
    <div className={`p-2 m-1 shadow rounded-xl text-chatTextWhite flex ${session?.user.name === msg.user.name ? "bg-zinc-800" : "bg-zinc-700"}`}>
      <Image
        src={msg.user.image || ""}
        className="rounded-full w-[30px] h-[30px] object-cover bg-black m-1"
        width={40}
        height={40}
        alt="User profile image"
      ></Image>
      <div className="flex-col  gap-1 w-full">
        <div className="flex items-center justify-between">
          <p className="text-chatTitle">{msg.user.name}</p>
          <p className="opacity-40">{msg.createdAt.toString()}</p>
        </div>
        <div className="w-full border-b opacity-10"></div>
        <div>
          <p>{msg.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
