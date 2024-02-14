import { FaUserFriends } from "react-icons/fa";
import { FaGear, FaUserPlus } from "react-icons/fa6";

import NavLinkButton from "../_ui/buttons/NavLinkButton";

export default function NavButtons() {
  return (
    <nav className="flex flex-col items-start  pb-1">
      <NavLinkButton
        icon={<FaUserFriends />}
        text="Amigos"
        urlPath="/me/friends"
      />

      <NavLinkButton
        icon={<FaUserPlus />}
        text="Buscar usuários"
        urlPath="/me/requests"
      />

      <NavLinkButton
        icon={<FaGear />}
        text="Configurações"
        urlPath="/me/config"
      />
      <div className="w-2/3 h-[1px] rounded m-2 bg-chatBackground2 mx-auto"></div>
    </nav>
  );
}
