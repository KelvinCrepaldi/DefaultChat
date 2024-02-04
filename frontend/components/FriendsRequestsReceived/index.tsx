"use client";

import { FriendRequestsContext } from "@/contexts/friendRequestContext";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import UserCard from "../_ui/UserCard";
import { IUser } from "@/interfaces/friends";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import { FaCheck } from "react-icons/fa";
import CounterText from "../_ui/CounterText";
import { FaTimes } from "react-icons/fa";
import Loading from "../_ui/Loading";

type requestTypes = {
  id: string;
  createdAt: string;
  type: string;
  requester: IUser;
};

const FriendsRequestsReceived = () => {
  const { data: session } = useSession();
  const {
    fetchFriendsRequests,
    requests,
    error,
    loading,
    acceptFriendRequest,
    declineFriendRequest,
  } = useContext(FriendRequestsContext);

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriendsRequests();
    }
  }, [session]);

  return (
    <section>
      <CounterText list={requests} text="Pedidos de amizade" />

      {error && <div>{error}</div>}

      {requests?.map((request: requestTypes) => (
        <UserCard user={request.requester} key={request.id}>
          <UserActionBtn
            actionId={request.id}
            color="green"
            handleFunction={acceptFriendRequest}
            icon={<FaCheck />}
          />
          <UserActionBtn
            actionId={request.id}
            color="red"
            handleFunction={declineFriendRequest}
            icon={<FaTimes />}
          />
        </UserCard>
      ))}
    </section>
  );
};

export default FriendsRequestsReceived;
