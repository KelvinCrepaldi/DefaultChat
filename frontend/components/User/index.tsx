"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
import Link from "next/link";
import IconSquare from "../_ui/IconSquare";
import NavContent from "../_ui/NavContent";
import UserAvatar from "../_ui/UserAvatar";

export default function User({ isHidden }: { isHidden: boolean }) {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (!session) {
    return <div className="min-h-[68px]" />;
  }

  return (
    <div className="flex items-center space-x-2 pt-5 pb-5 ">
      <NavContent
        hidden={isHidden}
        firstContent={
          <IconSquare>
            <div className="flex justify-center items-center space-x-5">
              <Link href={"/me"}>
                <UserAvatar
                  name={session?.user?.name || "?"}
                  image={session?.user?.picture}
                  size={40}
                />
              </Link>
            </div>
          </IconSquare>
        }
        secondContent={
          <div className="flex gap-2">
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
        }
      />
    </div>
  );
}
