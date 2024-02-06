"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLinkButtonProps = {
  text: string;
  urlPath: string;
  icon: React.ReactNode;
  activePath?: boolean;
};

const NavLinkButton = ({ text, urlPath, icon }: NavLinkButtonProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={urlPath}
      className={`flex w-full items-center  rounded-l-full p-2 hover:bg-chatBackground1  group ${
        pathname === urlPath ? "bg-chatBackground1" : "bg-chatBackground0"
      }`}
    >
      <div className=" bg-chatBackground0 rounded-full p-2 border border-chatText text-chatText group-hover:text-white">
        {icon}
      </div>
      <p className="text-chatText font-bold ml-2 group-hover:text-white">
        {text}
      </p>
    </Link>
  );
};

export default NavLinkButton;
