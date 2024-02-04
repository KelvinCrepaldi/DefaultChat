"use client";
import { ReactNode, createContext, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/services";
import { IFriend } from "@/interfaces/friends";

export type FriendsContextType = {
  friends: IFriend[];
  fetchFriends: () => void;
  deleteFriend: (friendId: string) => void;
  loading: boolean;
  error: IErrorResponse | null;
};

export const FriendsContext = createContext<FriendsContextType | null>(null);

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const { data: session } = useSession();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await api.get("api/friend", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });

      const data = response.data;
      setFriends(data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFriend = async (friendId: string) => {
    try {
      const response = await api.delete(`api/friend/${friendId}`, {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
      fetchFriends();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    fetchFriends();
  };

  return (
    <FriendsContext.Provider
      value={{ fetchFriends, deleteFriend, friends, loading, error }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
