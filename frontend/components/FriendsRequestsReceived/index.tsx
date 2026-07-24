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
import EmptyState from "../_ui/EmptyState";

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

      {!loading && (!requests || requests.length === 0) && (
        <EmptyState
          className="py-10"
          title="Nenhum pedido pendente"
          description="Quando alguém te enviar um pedido de amizade, ele aparece aqui para você aceitar ou recusar."
        />
      )}

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
