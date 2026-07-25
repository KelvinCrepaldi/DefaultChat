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

export default function GroupChat() {
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
  const divRef = useRef<HTMLDivElement>(null);
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
    if (divRef.current) {
      divRef.current.scrollIntoView();
    }
  }, [groupRooms, roomId]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <section className="p-2 bg-chatBackground2 grow h-full m-auto flex flex-col min-w-0">
        {room && <GroupChatHeader room={room} />}
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
      <GroupMembersSidebar members={room?.users || []} />
    </div>
  );
}
