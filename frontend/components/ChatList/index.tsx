"use client";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { IRoom, SocketContext } from "@/contexts/socketContext";

const ChatList = () => {
  const { data: session } = useSession();

  const { rooms } = useContext(
    SocketContext
  );

  useEffect(() => {
    if (session) {}
  }, [session]);

  return (
    <section>
      {rooms?.sort((a: IRoom, b: IRoom) => {
      if (a.status === "online" && b.status === "offline") {
        return -1;
      }
      else if (a.status === "offline" && b.status === "online") {
        return 1;
      }
      else {
        return a.user.name.localeCompare(b.user.name);
      }
    }).map((room: IRoom) => <ChatCard room={room} key={room.id} />)}  
    </section>
  );
};

type ChatCardProps = {
  room: IRoom,
}

const ChatCard = ({ room }: ChatCardProps) => {
  const pathname = usePathname()?.split("/")[3];

  const { push } = useRouter();
  const { rooms } = useContext(
    SocketContext
  );

  const goToChat = () => {
    push(`/me/chat/${room.user.id}`);
  
  };

  const handleCloseChat = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className="relative group cursor-pointer" onClick={goToChat}>
      <div
        className={`rounded-l-full p-2 flex gap-3 items-center border-b ${room?.notification > 0 ? "border-green-400" : "border-transparent"} ${
          pathname === room.user.id
            ? "bg-chatBackground2"
            : "bg-chatBackground0 hover:bg-chatBackground1"
        }`}
        key={room.id}
      >
        <Image
          src={room.user.image}
          className={`rounded-full w-[40px] h-[40px] object-cover bg-black border-2 ${room.status === "online" ? "border-green-600" : "border-zinc-600"}`}
          width={60}
          height={60}
          alt="User profile image"
        ></Image>
        <div className="flex justify-between items-center shrink w-full ">
          <div className="truncate ... max-w-[150px] text-chatCardHover">
            <span className="text-lg text-chatTitle font-semibold  ">
              {room.user.name} {room.notification}
            </span>
          </div>

          <button
            onClick={handleCloseChat}
            className="pr-3 rounded-full opacity-0 group-hover:opacity-100 text-chatTextWhite hover:text-chatBackground0 "
          >
            <FaXmark />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
