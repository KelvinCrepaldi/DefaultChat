"use client";

import { FaUserFriends } from "react-icons/fa";
import { FaGear, FaUserPlus } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import NavLinkButton from "../_ui/buttons/NavLinkButton";
import { useTranslation } from "react-i18next";

export default function NavButtons({ isHidden }: { isHidden: boolean }) {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col items-start  pb-1 ">
      <NavLinkButton
        icon={<FaUserFriends />}
        text={t("nav.friends")}
        urlPath="/me/friends"
        isHidden={isHidden}
      />

      <NavLinkButton
        icon={<FaUserPlus />}
        text={t("nav.searchUsers")}
        urlPath="/me/requests"
        isHidden={isHidden}
      />

      <NavLinkButton
        icon={<MdGroups />}
        text={t("nav.groups")}
        urlPath="/me/groups"
        isHidden={isHidden}
      />

      <NavLinkButton
        icon={<FaGear />}
        text={t("nav.settings")}
        urlPath="/me/config"
        isHidden={isHidden}
      />
      <div
        className={`${
          isHidden ? "w-[50px]" : "w-2/3 mx-auto"
        }  h-[1px] rounded m-2 bg-chatBackground2 `}
      ></div>
    </nav>
  );
}
