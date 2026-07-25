"use client";

import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { IPrivateRoom, useSocket } from "@/contexts/socketContext";
import type { ChatMessage } from "@/types/message";
import { useSession } from "next-auth/react";
import Message from "../_ui/Message";
import { useParams } from "next/navigation";
import ChatHeader from "../ChatHeader";
import { useTranslation } from "react-i18next";

export default function Chat() {
  const { t } = useTranslation();
  const { roomId } = useParams() as { roomId: string | null };
  const {
    sendMessage,
    privateRooms,
    error,
    resetPrivateNotificationCount,
  } = useSocket();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
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
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [privateRooms, roomId]);

  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-chatBackground2 p-2">
      {room && <ChatHeader room={room} />}
      <div
        ref={messagesRef}
        className="m-2 flex min-h-0 grow flex-col overflow-x-clip overflow-y-scroll rounded p-2"
      >
        {room?.messages?.map((msg: ChatMessage, index: number) => {
          return <Message msg={msg} key={index} />;
        })}
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
          {t("chat.send")}
        </button>
      </div>
    </section>
  );
}
