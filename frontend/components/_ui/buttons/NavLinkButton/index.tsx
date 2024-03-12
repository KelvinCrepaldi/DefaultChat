"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import IconSquare from "../../IconSquare";
import NavContent from "../../NavContent";

type NavLinkButtonProps = {
  text: string;
  urlPath: string;
  icon: React.ReactNode;
  activePath?: boolean;
  isHidden: boolean;
};

const NavLinkButton = ({ text, urlPath, icon, isHidden }: NavLinkButtonProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={urlPath}
      className={`w-full flex  items-center  rounded my-[1px] hover:bg-chatBackground1 mr-[2px]  group ${pathname === urlPath ? "bg-chatBackground1 mr-[0px] rounded-r-none" : "bg-chatBackground0"}`}
    >
      <NavContent
       hidden={isHidden}
       firstContent={
        <IconSquare>
        <div className=" bg-chatBackground0 rounded-full p-2 border-chatText text-chatText group-hover:text-white text-2xl">
        {icon}
        </div>
        </IconSquare>
       }
       secondContent={
        <p className="text-chatText font-bold group-hover:text-white flex items-center">
          {text}
        </p>  
       }
      />
    </Link>
  );
};

export default NavLinkButton;
