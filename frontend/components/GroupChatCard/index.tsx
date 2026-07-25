"use client";

import { useState, MouseEvent } from "react";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { IGroupRoom, useSocket } from "@/contexts/socketContext";
import { BiMessageDetail } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import IconSquare from "../_ui/IconSquare";
import NavContent from "../_ui/NavContent";
import { usePathname } from "next/navigation";

type GroupChatCardProps = {
  room: IGroupRoom;
  isHidden: boolean;
};

const GroupChatCard = ({ room, isHidden }: GroupChatCardProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const { closeRoom, openGroupRoom } = useSocket();
  const isActive = pathname === `/me/chat/group/${room.id}`;

  const goToChat = () => {
    openGroupRoom({ roomId: room.id });
  };

  const handleCloseChat = (e: MouseEvent<HTMLButtonElement>) => {
    closeRoom({ roomId: room.id });
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${
        isActive
          ? "bg-chatBackground2 rounded-r-none"
          : "bg-chatBackground0"
      } relative group cursor-pointer hover:bg-chatBackground1 py-1 rounded-l transition-all`}
      onClick={goToChat}
    >
      <NavContent
        hidden={isHidden}
        firstContent={
          <IconSquare>
            <div className="relative w-[40px] h-[40px] ml-[10px]">
              {room.image ? (
                <Image
                  src={room.image}
                  className="relative aspect-square rounded-full object-cover object-center bg-black"
                  width={60}
                  height={60}
                  alt="Group image"
                />
              ) : (
                <div className="w-[40px] h-[40px] rounded-full bg-chatBackground2 flex items-center justify-center text-chatTitle text-xl">
                  <MdGroups />
                </div>
              )}

              {room.notification > 0 && (
                <span className="bg-chatBackground0 rounded-full text-xs text-green-500 flex items-center gap-[2px] absolute -right-3 -bottom-1 p-[3px]">
                  <span className="text-[10px]">
                    <BiMessageDetail />
                  </span>
                  <span>{room.notification}</span>
                </span>
              )}
            </div>
          </IconSquare>
        }
        secondContent={
          <div className="flex justify-between w-full">
            <div className="flex justify-between items-center relative">
              <div className="truncate ... max-w-[100px] text-chatCardHover">
                <span className="pl-2 text-lg text-chatTitle font-semibold">
                  {room.name}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseChat}
              className="rounded-full opacity-0 group-hover:opacity-100 text-chatTextWhite hover:text-chatBackground0"
            >
              <FaXmark />
            </button>
          </div>
        }
      />
    </div>
  );
};

export default GroupChatCard;
