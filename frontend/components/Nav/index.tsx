import { FaUserFriends } from "react-icons/fa";
import { FaGear, FaUserPlus } from "react-icons/fa6";
import NavLinkButton from "../_ui/buttons/NavLinkButton";

export default function NavButtons({isHidden}: {isHidden: boolean}) {
  return (
    <nav className="flex flex-col items-start  pb-1"> 
      <NavLinkButton
        icon={<FaUserFriends />}
        text="Amigos"
        urlPath="/me/friends"
        isHidden={isHidden}
      />

      <NavLinkButton
        icon={<FaUserPlus />}
        text="Buscar usuários"
        urlPath="/me/requests"
        isHidden={isHidden}
      />

      <NavLinkButton
        icon={<FaGear />}
        text="Configurações"
        urlPath="/me/config"
        isHidden={isHidden}
      />
      <div className={`${isHidden ? "w-[50px]" : "w-2/3 mx-auto"}  h-[1px] rounded m-2 bg-chatBackground2 `}></div>
    </nav>
  );
}
