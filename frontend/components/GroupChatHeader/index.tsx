"use client";

import Image from "next/image";
import { MdGroups } from "react-icons/md";
import { IGroupRoom } from "@/contexts/socketContext";
import { useTranslation } from "react-i18next";

const GroupChatHeader = ({ room }: { room: IGroupRoom }) => {
  const { t } = useTranslation();
  const memberCount = room.users?.length || 0;

  return (
    <section className="w-full min-h-[70px] flex items-center gap-2 p-2">
      {room.image ? (
        <Image
          src={room.image}
          className="rounded-full w-[40px] h-[40px] object-cover bg-black"
          width={50}
          height={50}
          alt={t("groups.groupImageAlt")}
        />
      ) : (
        <div className="rounded-full w-[40px] h-[40px] bg-chatBackground0 flex items-center justify-center text-chatTitle text-2xl">
          <MdGroups />
        </div>
      )}
      <div className="flex-col gap-1 w-full">
        <h1 className="text-xl text-chatTitle">{room.name}</h1>
        <p className="text-sm text-chatText">
          {t("groups.membersCount", { count: memberCount })}
        </p>
      </div>
    </section>
  );
};

export default GroupChatHeader;
