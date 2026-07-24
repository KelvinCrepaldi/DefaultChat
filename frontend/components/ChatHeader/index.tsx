import { IPrivateRoom } from "@/contexts/socketContext";
import UserAvatar from "../_ui/UserAvatar";

const ChatHeader = ({ room }: { room: IPrivateRoom }) => {
  return (
    <section className="w-full min-h-[70px] flex items-center gap-2 p-2">
      <UserAvatar name={room.user.name} image={room.user.image} size={40} />
      <div className="flex-col  gap-1 w-full">
        <h1 className="text-xl text-chatTitle">{room.user.name}</h1>
      </div>
    </section>
  );
};

export default ChatHeader;
