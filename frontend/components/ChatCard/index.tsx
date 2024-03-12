"use client";

import { useContext, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { IPrivateRoom, SocketContext } from "@/contexts/socketContext";
import { BiMessageDetail } from "react-icons/bi";
import IconSquare from "../_ui/IconSquare";
import NavContent from "../_ui/NavContent";

type ChatCardProps = {
  room: IPrivateRoom,
  isHidden: boolean
}

const ChatCard = ({ room, isHidden }: ChatCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { closeRoom, openRoom, setActiveRoom } = useContext(
    SocketContext
  );

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
      <div className="relative group cursor-pointer hover:bg-chatBackground1 py-1" onClick={goToChat}>
        <NavContent 
          hidden={isHidden}
          firstContent={
            <IconSquare>
              <div className="relative w-[40px] h-[40px] ">
                <Image
                  src={room.image}
                  className={`relative aspect-square rounded-full object-cover object-center bg-black `}
                  width={60}
                  height={60}
                  alt="User profile image"
                ></Image>
                <div className={`absolute border  border-chatBackground0 w-[10px] h-[10px] rounded-full 
                ${room.status === "online" ? "bg-green-600" : "bg-zinc-600"} right-0 bottom-0`}/>

                {room.notification > 0 && 
                  <span className={`bg-chatBackground0 rounded-full text-xs text-green-500 flex  items-center gap-[2px] absolute -right-3 -bottom-1 p-[3px]`}>
                    <span className="text-[10px]">
                      <BiMessageDetail />
                    </span>
                   
                    <span className="">
                      {room.notification}
                    </span>
                </span>}

              </div>
            </IconSquare>
          }
          secondContent={
            <div className="flex justify-between items-center grow">
              <div className="truncate ... max-w-[150px] w-full text-chatCardHover">
                <span className="text-lg text-chatTitle font-semibold gap-x-2  flex items-center justify-between w-full">
                  {room.name} 
                </span>
              </div>

              <button
                onClick={handleCloseChat}
                className="pr-3 rounded-full opacity-0 group-hover:opacity-100 text-chatTextWhite hover:text-chatBackground0 "
              >
                <FaXmark />
              </button>
            </div>
          }
        />
      </div>
    );
  }
  return null
};

export default ChatCard;