import { IUser } from "@/interfaces/friends";
import Image from "next/image";
interface UserCardProps {
  user: IUser;
  children?: React.ReactNode;
}

const UserCard = ({ user, children }: UserCardProps) => {
  return (
    <div
      className="p-3 rounded flex justify-between items-center hover:shadow hover:bg-chatBackground0 transition-all"
      key={user.id}
    >
      <div className="flex items-center gap-3">
        <div>
        <Image
            src={user.image}
            className="rounded-full w-[40px] h-[40px] object-cover bg-black"
            width={50}
            height={50}
            alt="User profile image"
        />
        </div>
        <div className="flex flex-col truncate ">
          <p className="text-lg text-chatTitle font-semibold">{user.name}</p>
          <p className="truncate text-chatText text-xs opacity-80">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex gap-2 text-xl mr-3">{children}</div>
    </div>
  );
};

export default UserCard;
