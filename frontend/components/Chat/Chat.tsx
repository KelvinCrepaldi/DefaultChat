"use client";
import { useContext, useEffect, useState } from "react";
import { IRoom, SocketContext, socketMessage } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import Loading from "../_ui/Loading";
import Message from "../_ui/Message";

export default function Chat({ roomId }: { roomId: string }) {
  const {
    sendMessage,
    messages,
    joinRoom,
    rooms,
    error,
    scrollToBottom,
    listRef, activeRoom
  } = useContext(SocketContext);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const room: IRoom = rooms?.filter((room: IRoom) => room.user.id === roomId)[0]

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (session?.user && room) sendMessage({ message, user: session?.user, roomId: activeRoom });
    setMessage("");
  };

  useEffect(() => {
    joinRoom(roomId);
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!room) {
    return <Loading />;
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col">

      <div
        ref={listRef}
        className="m-2 p-2 rounded overflow-y-auto flex flex-col grow"
      >
        {room.messages?.map((msg: socketMessage, index: number) => (
          <Message msg={msg} key={index} />
        ))}
        <div>{error}</div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="w-full m-1 p-1 bg-slate-300 rounded"
        ></input>
        <button className="bg-gray-700 m-1 p-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}
