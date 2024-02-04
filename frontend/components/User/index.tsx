"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function User() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (!session) {
    return <div></div>;
  }

  return (
    <div className="flex items-center space-x-2 p-3 pt-5">
      <div className="flex justify-center items-center space-x-5">
        <Link href={"/me"}>
          <Image
            src={session?.user?.picture}
            className="rounded-full w-[40px] h-[40px] object-cover bg-black"
            width={50}
            height={50}
            alt="User profile image"
          ></Image>
        </Link>
      </div>

      <div>
        <div className="rounded-xl leading-3">
          <span className="font-bold text-chatTitle">
            {session?.user?.name}
          </span>
          <br />
          <span className="text-xs opacity-50 text-chatText">
            {session?.user?.email}
          </span>
        </div>
      </div>
      <button
        className="text-2xl text-chatTitle hover:text-red-400"
        onClick={handleLogout}
      >
        <IoMdLogOut />
      </button>
    </div>
  );
}
