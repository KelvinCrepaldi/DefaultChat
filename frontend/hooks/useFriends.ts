import { IFriend } from "@/interfaces/friends";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { useState } from "react";

const useFriends = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [friends, setFriends] = useState<IFriend[]>([]);
  const { data: session } = useSession();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/user/friend/list", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });

      const data = response.data;

      setFriends(data);
    } catch (error: any) {
      setError(error.response.body);
    } finally {
      setLoading(false);
    }
  };

  const deleteFriend = async (friendId: string) => {
    if (session?.user.accessToken) {
      try {
        setLoading(true);
        const response = await api.delete(
          `api/user/friend/delete/${friendId}`,
          {
            headers: { Authorization: `Bearer ${session?.user.accessToken}` },
          }
        );
      } catch (error: any) {
        setError(error.response.body);
      } finally {
        setLoading(false);
        fetchFriends();
      }
    }
  };

  return { friends, fetchFriends, deleteFriend };
};
export default useFriends;
