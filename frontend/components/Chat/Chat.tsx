"use client";
import { useContext, useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";
import { SocketContext, socketMessage } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import Loading from "../_ui/Loading";
import Image from "next/image";
import Message from "../_ui/Message";
import { IUser } from "@/interfaces/friends";

export default function Chat({ roomId }: { roomId: string }) {
  const { sendMessage, isConnected, messages, joinRoom, room, error } =
    useContext(SocketContext);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (session?.user) sendMessage({ message, user: session?.user });
    setMessage("");
  };

  useEffect(() => {
    joinRoom(roomId);
  }, [session]);

  if (!room) {
    return <Loading />;
  }

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col">
      <div className="m-2 p-2 rounded overflow-y-auto flex flex-col grow">
        {messages?.map((msg: socketMessage, index: number) => (
          <Message msg={msg} key={index} />
        ))}
      </div>

      <div className="flex">
        <input
          value={message}
          onChange={handleChange}
          className="w-full m-1 p-1 bg-slate-300 rounded"
        ></input>
        <button className="bg-gray-700 m-1 p-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}
