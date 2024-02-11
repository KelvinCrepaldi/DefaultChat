import { socketMessage } from "@/contexts/socketContext";
import formatDate from "@/utils/formatDate";
import Image from "next/image";

const Message = ({ msg }: { msg: socketMessage }) => {
  return (
    <div className="p-2 m-1 shadow bg-chatBorder rounded-xl text-chatTextWhite flex">
      <Image
        src={msg.user.image || ""}
        className="rounded-full w-[30px] h-[30px] object-cover bg-black m-1"
        width={40}
        height={40}
        alt="User profile image"
      ></Image>
      <div className="flex-col  gap-1 w-full">
        <div className="flex items-center justify-between">
          <p className="text-chatTitle">{msg.user.name}</p>
          <p className="opacity-40">{msg.createdAt.toString()}</p>
        </div>
        <div className="w-full border-b opacity-10"></div>
        <div>
          <p>{msg.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
