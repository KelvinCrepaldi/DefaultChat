"server component";
import { IUser } from "@/interfaces/friends";
import { api } from "@/services";
import Image from "next/image";

const ChatHeader = async ({ userId }: { userId: string }) => {
  const user = await api.get(`api/user/${userId}`);

  return (
    <section className="w-full h-[70px] flex items-center gap-2 p-2">
      <Image
        src={user.data.image}
        className="rounded-full w-[40px] h-[40px] object-cover bg-black"
        width={50}
        height={50}
        alt="User profile image"
      ></Image>
      <div className="flex-col  gap-1 w-full">
        <h1 className="text-xl text-chatTitle">{user?.data.name}</h1>
      </div>
    </section>
  );
};

export default ChatHeader;
