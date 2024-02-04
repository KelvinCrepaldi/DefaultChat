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
        <SocketProvider>
          <UserSearchProvider>
            <FriendsProvider>
              <ActiveChatProvider>
                <FriendRequestsProvider>{children}</FriendRequestsProvider>
              </ActiveChatProvider>
            </FriendsProvider>
          </UserSearchProvider>
        </SocketProvider>
      </SessionProvider>
    </>
  );
}
