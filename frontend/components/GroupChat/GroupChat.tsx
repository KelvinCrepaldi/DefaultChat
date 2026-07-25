"use client";

import {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { IGroupRoom, useSocket } from "@/contexts/socketContext";
import type { ChatMessage } from "@/types/message";
import { useSession } from "next-auth/react";
import Message from "../_ui/Message";
import { useParams } from "next/navigation";
import GroupChatHeader from "../GroupChatHeader";
import GroupMembersSidebar from "../GroupMembersSidebar";
import { api } from "@/services";
import { useTranslation } from "react-i18next";

export default function GroupChat() {
  const { t } = useTranslation();
  const { roomId } = useParams() as { roomId: string };
  const {
    sendMessage,
    groupRooms,
    error,
    resetPrivateNotificationCount,
    fetchMessage,
    setGroupRooms,
  } = useSocket();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const room = groupRooms?.find((r: IGroupRoom) => r.id === roomId);

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
      if (!room.messages?.length) {
        fetchMessage({ roomId: room.id });
      }
    }
  }, [room?.id]);

  useEffect(() => {
    const refreshMembers = async () => {
      if (!session?.user.accessToken || !roomId) return;
      try {
        const response = await api.get(`api/room/group/${roomId}`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        const detail = response.data;
        setGroupRooms((prev) => {
          const exists = prev.some((r) => r.id === roomId);
          if (!exists) {
            return [
              ...prev,
              {
                id: detail.id,
                name: detail.name,
                image: detail.image,
                users: detail.users || [],
                messages: detail.messages || [],
                notification: detail.notification || 0,
              },
            ];
          }
          return prev.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  users: detail.users || r.users,
                  name: detail.name || r.name,
                  image: detail.image ?? r.image,
                }
              : r
          );
        });
      } catch (err: unknown) {
        console.log(err);
      }
    };
    refreshMembers();
  }, [roomId, session?.user.accessToken]);

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
  }, [groupRooms, roomId]);

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <section className="flex h-full min-h-0 min-w-0 grow flex-col bg-chatBackground2 p-2">
        {room && <GroupChatHeader room={room} />}
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
      <GroupMembersSidebar members={room?.users || []} />
    </div>
  );
}
