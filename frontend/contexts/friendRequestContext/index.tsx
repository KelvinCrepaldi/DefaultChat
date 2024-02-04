"use client";
import { api } from "@/services";
import { ReactNode, createContext, useState } from "react";
import { IFriendRequestsResponse } from "@/interfaces/friends";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { FriendsContext, FriendsContextType } from "../friendsContext";

export const FriendRequestsContext = createContext<any>(undefined);

export const FriendRequestsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [requests, setRequests] = useState<IFriendRequestsResponse[] | null>(
    null
  );
  const { fetchFriends } = useContext(FriendsContext) as FriendsContextType;
  const { data: session } = useSession();

  const fetchFriendsRequests = async () => {
    if (session) {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("api/friend/requests/received", {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });

        const data = response.data;

        setRequests(data);
      } catch (error: any) {
        setError(error.response.body);
      } finally {
        setLoading(false);
      }
    }
  };

  const acceptFriendRequest = async (actionId: string) => {
    if (session) {
      setError(null);
      try {
        await api.post(
          `api/friend/${actionId}/accept`,
          {},
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      } catch (error: any) {
        setError(error.response.body);
      } finally {
        fetchFriends();
        fetchFriendsRequests();
      }
    }
  };

  const declineFriendRequest = async (actionId: string) => {
    if (session) {
      setError(null);
      try {
        const response = await api.post(
          `api/friend/${actionId}/decline`,
          {},
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      } catch (error: any) {
        setError(error.response.body);
      } finally {
        fetchFriendsRequests();
      }
    }
  };

  return (
    <FriendRequestsContext.Provider
      value={{
        fetchFriendsRequests,
        requests,
        error,
        loading,
        acceptFriendRequest,
        declineFriendRequest,
      }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
};
