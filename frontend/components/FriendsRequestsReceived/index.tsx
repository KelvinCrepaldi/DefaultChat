"use client";

import { useFriendRequests } from "@/contexts/friendRequestContext";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import UserCard from "../_ui/UserCard";
import { FriendRequest } from "@/interfaces/friends";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import { FaCheck } from "react-icons/fa";
import CounterText from "../_ui/CounterText";
import { FaTimes } from "react-icons/fa";
import Loading from "../_ui/Loading";
import { useFriends } from "@/contexts/friendsContext";
import { useTranslation } from "react-i18next";

const FriendsRequestsReceived = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const {
    fetchFriendsRequests,
    requests,
    error,
    loading,
    acceptFriendRequest,
    declineFriendRequest,
  } = useFriendRequests();

  const { friends } = useFriends();
  const hasFriends = friends && friends.length > 0;

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchFriendsRequests();
    }
  }, [session]);

  return (
    <section>
      <CounterText list={requests} text={t("friends.requestsTitle")} />

      {error && <div>{error.message}</div>}

      {loading && (!requests || requests.length === 0) && (
        <div className="flex justify-center py-6">
          <Loading />
        </div>
      )}

      {!loading && (!requests || requests.length === 0) && hasFriends && (
        <p className="text-chatText text-sm py-2">{t("friends.noRequests")}</p>
      )}

      {requests?.map((request: FriendRequest) => (
        <UserCard user={request.requester} key={request.id}>
          <UserActionBtn
            actionId={request.id}
            color="green"
            handleFunction={acceptFriendRequest}
            icon={<FaCheck />}
            title={t("friends.accept")}
          />
          <UserActionBtn
            actionId={request.id}
            color="red"
            handleFunction={declineFriendRequest}
            icon={<FaTimes />}
            title={t("friends.decline")}
          />
        </UserCard>
      ))}
    </section>
  );
};

export default FriendsRequestsReceived;
