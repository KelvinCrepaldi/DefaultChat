"use client";
import Chat from "@/components/Chat/Chat";
import ChatHeader from "@/components/ChatHeader";

import { useParams } from "next/navigation";

export default function Chats() {
  const params = useParams<{ roomId: string }>();

  if (!params) {
    return <div>error</div>;
  }

  return (
    <section>
      <ChatHeader userId={params?.roomId} />
      <div className="h-[calc(100vh-70px)] overflow-hidden">
        {params?.roomId && <Chat roomId={params?.roomId} />}
      </div>
    </section>
  );
}
