"use client";

import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaMessage, FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { IPrivateRoom, SocketContext } from "@/contexts/socketContext";
import ChatCard from "../ChatCard";

const ChatList = ({isHidden}: {isHidden: boolean}) => {
  const { privateRooms } = useContext(
    SocketContext
  );

  return (
    <section>
      {privateRooms?.sort((a: IPrivateRoom, b: IPrivateRoom) => {
      if (a.status === "online" && b.status === "offline") {
        return -1;
      }
      else if (a.status === "offline" && b.status === "online") {
        return 1;
      }
      else {
        return a.user.name.localeCompare(b.user.name);
      }
    }).map((room: IPrivateRoom) => <ChatCard isHidden={isHidden} room={room} key={room.id} />)}  
    </section>
  );
};

/* const ChatCard = ({ room }: ChatCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { closeRoom, openRoom, setActiveRoom } = useContext(
    SocketContext
  );
  const pathname = usePathname()?.split("/")[3];
  const { push } = useRouter();

  const goToChat = () => {
    openRoom({userId: room.user.id});
  };

  const handleCloseChat = (e: any) => {
    closeRoom({roomId: room.id})
    e.stopPropagation();
    setIsOpen(prev => !prev)
  };

  if(isOpen){
    return (
      <div className="relative group cursor-pointer" onClick={goToChat}>
        <div
          className={`rounded p-2 flex gap-2
          ${room.notification > 0 ? "border-green-400" : "border-transparent"} ${
            pathname === room.user.id
              ? "bg-chatBackground2 mr-[0px] rounded-r-none"
              : "bg-chatBackground0 hover:bg-chatBackground1"
          }`}
          key={room.id}
        >
          <div className="relative w-[40px] h-[40px] ">
            <Image
              src={room.image}
              className={`relative aspect-square rounded-full object-cover object-center bg-black `}
              width={60}
              height={60}
              alt="User profile image"
            ></Image>
            <div className={`absolute border  border-chatBackground0 w-[10px] h-[10px] rounded-full ${room.status === "online" ? "bg-green-600" : "bg-zinc-600"} right-0 bottom-0`}/>
          </div>
          
          <div className="flex justify-between items-center grow">
            <div className="truncate ... max-w-[150px] w-full text-chatCardHover">
              <span className="text-lg text-chatTitle font-semibold gap-x-2  flex items-center justify-between w-full">
                {room.name} 
                {room.notification > 0 && 
                <span className="text-xs text-green-500 flex  items-center gap-[2px]">
                  <span className="">
                    {room.notification}
                  </span>
                  <FaMessage />
                </span>}
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
  }
  return null
}; */

export default ChatList;
