"use client";
import { SessionProvider } from "next-auth/react";
import { FriendRequestsProvider } from "@/contexts/friendRequestContext";
import { UserSearchProvider } from "@/contexts/userSearchContext";
import { SocketProvider } from "@/contexts/socketContext";
import { FriendsProvider } from "@/contexts/friendsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
            <UserSearchProvider>
              <FriendsProvider>
                <FriendRequestsProvider>{children}</FriendRequestsProvider>
              </FriendsProvider>
            </UserSearchProvider>
      </SessionProvider>
    </>
  );
}
