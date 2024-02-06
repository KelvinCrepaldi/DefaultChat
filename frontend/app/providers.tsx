"use client";
import { SessionProvider } from "next-auth/react";
import { FriendRequestsProvider } from "@/contexts/friendRequestContext";
import { UserSearchProvider } from "@/contexts/userSearchContext";
import { SocketProvider } from "@/contexts/socketContext";
import { FriendsProvider } from "@/contexts/friendsContext";
import { ActiveChatProvider } from "@/contexts/activeChatsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <ActiveChatProvider>
          <SocketProvider>
            <UserSearchProvider>
              <FriendsProvider>
                <FriendRequestsProvider>{children}</FriendRequestsProvider>
              </FriendsProvider>
            </UserSearchProvider>
          </SocketProvider>
        </ActiveChatProvider>
      </SessionProvider>
    </>
  );
}
