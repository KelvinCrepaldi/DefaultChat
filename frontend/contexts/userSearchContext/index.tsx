"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { IUser } from "@/interfaces/friends";
import { toApiErrorState } from "@/types/api";
import axios from "axios";

type SearchUserInput = {
  letters: string;
};

export type UserSearchContextValue = {
  searchUser: (input: SearchUserInput) => Promise<void>;
  loading: boolean;
  error: IErrorResponse | null;
  usersList: IUser[] | null;
  inviteFriendUser: (actionId: string) => Promise<boolean>;
};

export const UserSearchContext = createContext<UserSearchContextValue | null>(
  null
);

export function useUserSearch(): UserSearchContextValue {
  const ctx = useContext(UserSearchContext);
  if (!ctx) {
    throw new Error("useUserSearch must be used within UserSearchProvider");
  }
  return ctx;
}

export const UserSearchProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [usersList, setUsersList] = useState<IUser[] | null>(null);
  const { data: session } = useSession();

  const searchUser = async ({ letters }: SearchUserInput) => {
    if (!session?.user?.accessToken) return;
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<IUser[]>(
        `api/user/search?letters=${letters}`,
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );

      setUsersList(response.data);
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      setLoading(false);
    }
  };

  const inviteFriendUser = async (actionId: string): Promise<boolean> => {
    if (!session?.user?.accessToken) return false;
    try {
      await api.post(
        `api/friend/${actionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        return true;
      }
      console.log(axios.isAxiosError(err) ? err.response?.data : err);
      return false;
    }
  };

  const value: UserSearchContextValue = {
    searchUser,
    loading,
    error,
    usersList,
    inviteFriendUser,
  };

  return (
    <UserSearchContext.Provider value={value}>
      {children}
    </UserSearchContext.Provider>
  );
};
