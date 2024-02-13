import Chat from "@/components/Chat/Chat";
import ChatHeader from "@/components/ChatHeader";

import { useParams } from "next/navigation";

export default function Chats() {
  
  return (
    <section>
      <div className="h-[calc(100vh-70px)] overflow-hidden">
       <Chat />
      </div>
    </section>
  );
}
