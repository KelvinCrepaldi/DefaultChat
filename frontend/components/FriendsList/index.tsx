"use client";
import UserCard from "@/components/_ui/UserCard";
import { IFriend } from "@/interfaces/friends";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoPersonRemove } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { useContext, useEffect } from "react";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import CounterText from "../_ui/CounterText";
import { FriendsContext, FriendsContextType } from "@/contexts/friendsContext";
import { SocketContext } from "@/contexts/socketContext";

const FriendsList = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { fetchFriends, deleteFriend, friends,  } = useContext(
    FriendsContext
  ) as FriendsContextType;

  const { openRoom  } = useContext(
    SocketContext
  )

  const goToChat = (userId: string) => {
    openRoom({userId})
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriends();
    }
  }, [session]);

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
