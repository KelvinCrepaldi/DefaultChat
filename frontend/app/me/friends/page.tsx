"use client";

import FriendsList from "@/components/FriendsList";
import RequestsReceived from "@/components/FriendsRequestsReceived";
import HeaderSection from "@/components/_ui/HeaderSection";
import { useContext } from "react";
import { FriendsContext, FriendsContextType } from "@/contexts/friendsContext";

function FriendsContent() {
  const { friends, loading } = useContext(FriendsContext) as FriendsContextType;
  const hasFriends = !loading && friends && friends.length > 0;

  return (
    <div className="p-4">
      {(hasFriends || loading) && (
        <>
          <RequestsReceived />
          {hasFriends && <div className="my-6 border-b border-chatBorder" />}
        </>
      )}
      <FriendsList />
    </div>
  );
}

export default function Friends() {
  return (
    <section className="h-full overflow-y-auto">
      <HeaderSection text="Amigos" />
      <FriendsContent />
    </section>
  );
}
