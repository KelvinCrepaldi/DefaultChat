import Image from "next/image";
import Link from "next/link";
import User from "../../User";

export default function Header(): JSX.Element {
  return (
    <header className="px-4 p-2 w-full flex items-center justify-between ">
      <Link href={"/"} className="">
        <Image
          src="/defaultchatlogo.svg"
          alt="default chat logo"
          width={40}
          height={40}
          priority
        />
      </Link>
    </header>
  );
}
