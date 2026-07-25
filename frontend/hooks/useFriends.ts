import { IFriend } from "@/interfaces/friends";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toApiErrorState } from "@/types/api";

const useFriends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [friends, setFriends] = useState<IFriend[]>([]);
  const { data: session } = useSession();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await api.get<IFriend[]>("api/user/friend/list", {
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
    if (!session?.user.accessToken) return;
    try {
      setLoading(true);
      await api.delete(`api/user/friend/delete/${friendId}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
    } catch (err: unknown) {
      setError(toApiErrorState(err));
    } finally {
      setLoading(false);
      await fetchFriends();
    }
  };

  return { friends, fetchFriends, deleteFriend, loading, error };
};
export default useFriends;
