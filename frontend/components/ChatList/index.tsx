"use client";

import { useContext } from "react";
import { IGroupRoom, IPrivateRoom, SocketContext } from "@/contexts/socketContext";
import ChatCard from "../ChatCard";
import GroupChatCard from "../GroupChatCard";

const ChatList = ({ isHidden }: { isHidden: boolean }) => {
  const { privateRooms, groupRooms } = useContext(SocketContext);
  const hasPrivate = privateRooms?.length > 0;
  const hasGroups = groupRooms?.length > 0;
  const isEmpty = !hasPrivate && !hasGroups;

  return (
    <section>
      {isEmpty && !isHidden && (
        <p className="text-chatText text-xs text-center px-3 py-4 leading-relaxed">
          Nenhuma conversa aberta. Adicione amigos ou entre em um grupo para
          começar.
        </p>
      )}

      {privateRooms
        ?.sort((a: IPrivateRoom, b: IPrivateRoom) => {
          if (a.status === "online" && b.status === "offline") {
            return -1;
          } else if (a.status === "offline" && b.status === "online") {
            return 1;
          } else {
            return a.user.name.localeCompare(b.user.name);
          }
        })
        .map((room: IPrivateRoom) => (
          <ChatCard isHidden={isHidden} room={room} key={room.id} />
        ))}

      {groupRooms?.length > 0 && (
        <div
          className={`${
            isHidden ? "w-[50px]" : "w-2/3 mx-auto"
          } h-[1px] rounded m-2 bg-chatBackground2`}
        />
      )}

      {groupRooms?.map((room: IGroupRoom) => (
        <GroupChatCard isHidden={isHidden} room={room} key={room.id} />
      ))}
    </section>
  );
};

export default ChatList;
