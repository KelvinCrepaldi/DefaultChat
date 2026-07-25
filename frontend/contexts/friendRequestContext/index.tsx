"use client";

import { api } from "@/services";
import { ReactNode, createContext, useContext, useState } from "react";
import { FriendRequest } from "@/interfaces/friends";
import { useSession } from "next-auth/react";
import { useFriends } from "../friendsContext";
import { toApiErrorState } from "@/types/api";

export type FriendRequestsContextValue = {
  fetchFriendsRequests: () => Promise<void>;
  requests: FriendRequest[] | null;
  error: IErrorResponse | null;
  loading: boolean;
  acceptFriendRequest: (actionId: string) => Promise<void>;
  declineFriendRequest: (actionId: string) => Promise<void>;
};

export const FriendRequestsContext =
  createContext<FriendRequestsContextValue | null>(null);

export function useFriendRequests(): FriendRequestsContextValue {
  const ctx = useContext(FriendRequestsContext);
  if (!ctx) {
    throw new Error(
      "useFriendRequests must be used within FriendRequestsProvider"
    );
  }
  return ctx;
}

export const FriendRequestsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [requests, setRequests] = useState<FriendRequest[] | null>(null);
  const { fetchFriends } = useFriends();
  const { data: session } = useSession();

  const fetchFriendsRequests = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<FriendRequest[]>(
        "api/friend/requests/received",
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      setRequests(response.data);
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (actionId: string) => {
    if (!session) return;
    setError(null);
    try {
      await api.post(
        `api/friend/${actionId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      await fetchFriends();
      await fetchFriendsRequests();
    }
  };

  const declineFriendRequest = async (actionId: string) => {
    if (!session) return;
    setError(null);
    try {
      await api.post(
        `api/friend/${actionId}/decline`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      fetchFriendsRequests();
    }
  };

  const value: FriendRequestsContextValue = {
    fetchFriendsRequests,
    requests,
    error,
    loading,
    acceptFriendRequest,
    declineFriendRequest,
  };

  return (
    <FriendRequestsContext.Provider value={value}>
      {children}
    </FriendRequestsContext.Provider>
  );
};
