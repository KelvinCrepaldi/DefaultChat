"use client";

import { FriendRequestsContext } from "@/contexts/friendRequestContext";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import UserCard from "../_ui/UserCard";
import { IUser } from "@/interfaces/friends";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import { FaCheck } from "react-icons/fa";
import CounterText from "../_ui/CounterText";
import { FaTimes } from "react-icons/fa";
import Loading from "../_ui/Loading";
import { FriendsContext, FriendsContextType } from "@/contexts/friendsContext";

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

  const { friends } = useContext(FriendsContext) as FriendsContextType;
  const hasFriends = friends && friends.length > 0;

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriendsRequests();
    }
  }, [session]);

  return (
    <section>
      <CounterText list={requests} text="Pedidos de amizade" />

      {error && <div>{error}</div>}

      {loading && (!requests || requests.length === 0) && (
        <div className="flex justify-center py-6">
          <Loading />
        </div>
      )}

      {!loading && (!requests || requests.length === 0) && hasFriends && (
        <p className="text-chatText text-sm py-2">
          Nenhum pedido de amizade pendente.
        </p>
      )}

      {requests?.map((request: requestTypes) => (
        <UserCard user={request.requester} key={request.id}>
          <UserActionBtn
            actionId={request.id}
            color="green"
            handleFunction={acceptFriendRequest}
            icon={<FaCheck />}
            title="Aceitar pedido"
          />
          <UserActionBtn
            actionId={request.id}
            color="red"
            handleFunction={declineFriendRequest}
            icon={<FaTimes />}
            title="Recusar pedido"
          />
        </UserCard>
      ))}
    </section>
  );
};

export default FriendsRequestsReceived;
