"use client";
import UserCard from "@/components/_ui/UserCard";
import { IFriend } from "@/interfaces/friends";
import { useSession } from "next-auth/react";
import { IoPersonRemove } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { useContext, useEffect } from "react";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import CounterText from "../_ui/CounterText";
import EmptyState from "../_ui/EmptyState";
import { FriendsContext, FriendsContextType } from "@/contexts/friendsContext";
import { SocketContext } from "@/contexts/socketContext";

const FriendsList = () => {
  const { data: session } = useSession();

  const { fetchFriends, deleteFriend, friends, loading } = useContext(
    FriendsContext
  ) as FriendsContextType;

  const { openRoom } = useContext(SocketContext);

  const goToChat = (userId: string) => {
    openRoom({ userId });
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriends();
    }
  }, [session]);

  if (!loading && (!friends || friends.length === 0)) {
    return (
      <EmptyState
        title="Nenhum amigo ainda"
        description="Você ainda não adicionou ninguém. Busque usuários e envie pedidos de amizade para começar a conversar."
        actionHref="/me/requests"
        actionLabel="Buscar usuários"
      />
    );
  }

  return (
    <section className="w-full h-full ">
      <CounterText list={friends} text="Amigos adicionados" />

      {friends?.map((friend: IFriend) => (
        <UserCard key={friend.id} user={friend.addressee}>
          <UserActionBtn
            actionId={friend.addressee.id}
            icon={<BiMessageDetail />}
            handleFunction={goToChat}
            color="green"
          ></UserActionBtn>
          <UserActionBtn
            actionId={friend.addressee.id}
            icon={<IoPersonRemove />}
            handleFunction={deleteFriend}
            color="red"
          ></UserActionBtn>
        </UserCard>
      ))}
    </section>
  );
};

export default FriendsList;
