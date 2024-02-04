"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { IUser } from "@/interfaces/friends";

export const UserSearchContext = createContext<any>(undefined);

type searchUserType = {
  letters: string;
};

type inviteFriendUserType = {
  actionId: string;
};

export const UserSearchProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [usersList, setUsersList] = useState<IUser[] | null>(null);
  const { data: session } = useSession();

  const searchUser = async ({ letters }: searchUserType) => {
    if (session?.user?.accessToken) {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`api/user/search?letters=${letters}`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });

        const data = response.data;

        setUsersList(data);
      } catch (error: any) {
        setError(error.response.data);
      } finally {
        setLoading(false);
      }
    }
  };

  const inviteFriendUser = async (actionId: string): Promise<boolean> => {
    if (session?.user?.accessToken) {
      try {
        const response = await api.post(
          `api/friend/${actionId}`,
          {},
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
        const data = response.data;
        return true;
      } catch (error: any) {
        console.log(error.response.data);
      }
    }
    return false;
  };

  return (
    <UserSearchContext.Provider
      value={{ searchUser, loading, error, usersList, inviteFriendUser }}
    >
      {children}
    </UserSearchContext.Provider>
  );
};
