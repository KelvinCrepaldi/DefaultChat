"use client";

import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { IPrivateRoom, useSocket } from "@/contexts/socketContext";
import type { ChatMessage } from "@/types/message";
import { useSession } from "next-auth/react";
import Message from "../_ui/Message";
import { useParams } from "next/navigation";
import ChatHeader from "../ChatHeader";

export default function Chat() {
  const { roomId } = useParams() as { roomId: string | null };
  const {
    sendMessage,
    privateRooms,
    error,
    resetPrivateNotificationCount,
  } = useSocket();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const room = privateRooms?.find(
    (r: IPrivateRoom) => r.user.id === roomId
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || !session?.user || !room?.id) return;
    sendMessage({ message: trimmed, roomId: room.id });
    setMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (room?.id) {
      resetPrivateNotificationCount({ roomId: room.id });
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView();
    }
  }, [privateRooms, roomId]);

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col ">
      {room && <ChatHeader room={room} />}
      <div className="m-2 p-2 rounded overflow-y-scroll overflow-x-clip flex flex-col grow">
        {room?.messages?.map((msg: ChatMessage, index: number) => {
          return <Message msg={msg} key={index} />;
        })}
        <div ref={divRef}></div>
        <div>{error?.message}</div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          ref={inputRef}
          className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1 focus:ring-0 focus:outline-none"
        />
        <button
          className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </section>
  );
}
