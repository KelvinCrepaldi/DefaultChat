import Link from "next/link";

type NavLinkButtonProps = {
  text: string;
  urlPath: string;
  icon: React.ReactNode;
};

const NavLinkButton = ({ text, urlPath, icon }: NavLinkButtonProps) => {
  return (
    <Link
      href={urlPath}
      className="flex w-full items-center bg-chatBackground0 rounded-full p-2 hover:bg-chatBackground1  group"
    >
      <div className=" bg-chatBackground0 rounded-full p-2 border border-chatBorder text-chatBorder group-hover:text-white">
        {icon}
      </div>
      <span className="text-chatText opacity-60 font-bold ml-2">{text}</span>
    </Link>
  );
};

export default NavLinkButton;
