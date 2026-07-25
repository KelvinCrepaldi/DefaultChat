"use client";
import UserCard from "@/components/_ui/UserCard";
import { IFriend } from "@/interfaces/friends";
import { useSession } from "next-auth/react";
import { IoPersonRemove } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { useEffect } from "react";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import CounterText from "../_ui/CounterText";
import EmptyState from "../_ui/EmptyState";
import Loading from "../_ui/Loading";
import { useFriends } from "@/contexts/friendsContext";
import { useSocket } from "@/contexts/socketContext";

const FriendsList = () => {
  const { data: session } = useSession();
  const { fetchFriends, deleteFriend, friends, loading } = useFriends();
  const { openRoom } = useSocket();

  const goToChat = (userId: string) => {
    openRoom({ userId });
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriends();
    }
  }, [session]);

  if (loading && (!friends || friends.length === 0)) {
    return (
      <div className="flex justify-center py-16">
        <Loading />
      </div>
    );
  }

  if (!loading && (!friends || friends.length === 0)) {
    return (
      <EmptyState
        className="min-h-[50vh]"
        title="Nenhum amigo ainda"
        description="Você ainda não adicionou ninguém. Busque usuários para enviar pedidos de amizade ou entre em um grupo para conhecer pessoas."
        actions={[
          { href: "/me/requests", label: "Buscar usuários" },
          { href: "/me/groups", label: "Ver grupos" },
        ]}
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
            title="Abrir conversa"
          />
          <UserActionBtn
            actionId={friend.addressee.id}
            icon={<IoPersonRemove />}
            handleFunction={deleteFriend}
            color="red"
            title="Remover amigo"
          />
        </UserCard>
      ))}
    </section>
  );
};

export default FriendsList;
