"use client";
import { ReactNode, createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/services";
import { IFriend } from "@/interfaces/friends";
import { toApiErrorState } from "@/types/api";

export type FriendsContextType = {
  friends: IFriend[];
  fetchFriends: () => Promise<void>;
  deleteFriend: (friendId: string) => Promise<void>;
  loading: boolean;
  error: IErrorResponse | null;
};

export const FriendsContext = createContext<FriendsContextType | null>(null);

export function useFriends(): FriendsContextType {
  const ctx = useContext(FriendsContext);
  if (!ctx) {
    throw new Error("useFriends must be used within FriendsProvider");
  }
  return ctx;
}

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const { data: session } = useSession();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<IFriend[]>("api/friend", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
      setFriends(response.data);
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      setLoading(false);
    }
  };

  const deleteFriend = async (friendId: string) => {
    try {
      setError(null);
      await api.delete(`api/friend/${friendId}`, {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      setLoading(false);
      await fetchFriends();
    }
  };

  return (
    <FriendsContext.Provider
      value={{ fetchFriends, deleteFriend, friends, loading, error }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
