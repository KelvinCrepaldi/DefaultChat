import { FaUserFriends } from "react-icons/fa";
import { FaGear, FaUserPlus } from "react-icons/fa6";
import NavLinkButton from "../_ui/buttons/NavLinkButton";

export default function NavButtons() {
  return (
    <nav className="flex flex-col items-start  pb-1">
      <NavLinkButton
        icon={<FaUserFriends />}
        text="Amigos"
        urlPath="/dashboard/friends"
      />

      <NavLinkButton
        icon={<FaUserPlus />}
        text="Notificações"
        urlPath="/dashboard/requests"
      />

      <NavLinkButton
        icon={<FaGear />}
        text="Configurações"
        urlPath="/dashboard/config"
      />
      <div className="w-1/2 h-[2px] rounded m-2 bg-chatCard mx-auto"></div>
    </nav>
  );
}
