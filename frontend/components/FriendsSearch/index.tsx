"use client";
import { useUserSearch } from "@/contexts/userSearchContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUser } from "@/interfaces/friends";
import UserCard from "../_ui/UserCard";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import { FaUserPlus } from "react-icons/fa6";
import CounterText from "../_ui/CounterText";
import EmptyState from "../_ui/EmptyState";
import Loading from "../_ui/Loading";
import { api } from "@/services";
import { useTranslation } from "react-i18next";

const searchSchema = yup.object().shape({
  letters: yup.string().required(),
});

type SearchFormValues = {
  letters: string;
};

const FriendsSearch = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCooldown, setSearchCooldown] = useState(false);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const { searchUser, loading, usersList, inviteFriendUser } = useUserSearch();

  const { handleSubmit, register } = useForm<SearchFormValues>({
    resolver: yupResolver(searchSchema),
  });

  useEffect(() => {
    const loadSent = async () => {
      if (!session?.user.accessToken) return;
      try {
        const response = await api.get("api/friend/requests/sent", {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        const sent = Array.isArray(response.data) ? response.data : [];
        const ids = sent
          .map((r: { addressee?: { id: string } }) => r.addressee?.id)
          .filter((id: string | undefined): id is string => Boolean(id));
        setInvitedIds(new Set(ids));
      } catch {
        // ignore prefetch errors
      }
    };
    loadSent();
  }, [session?.user.accessToken]);

  const handleSearchSubmit = async (data: SearchFormValues) => {
    if (loading || searchCooldown) return;
    setHasSearched(true);
    setSearchCooldown(true);
    try {
      await searchUser(data);
    } finally {
      setTimeout(() => setSearchCooldown(false), 1000);
    }
  };

  const handleInvite = async (userId: string) => {
    const ok = await inviteFriendUser(userId);
    if (ok) {
      setInvitedIds((prev) => new Set(prev).add(userId));
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit(handleSearchSubmit)} className="mb-5">
        <div className="flex">
          <input
            {...register("letters")}
            placeholder={t("friends.searchPlaceholder")}
            className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1"
          />
          <button
            type="submit"
            disabled={loading || searchCooldown}
            className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("friends.search")}
          </button>
        </div>
      </form>

      <div>
        <CounterText list={usersList} text={t("friends.found")} />

        {loading && (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        )}

        {!hasSearched && !loading && (
          <EmptyState
            className="py-12 min-h-[40vh]"
            title={t("friends.findTitle")}
            description={t("friends.findDesc")}
          />
        )}

        {hasSearched && !loading && (!usersList || usersList.length === 0) && (
          <EmptyState
            className="py-12 min-h-[40vh]"
            title={t("friends.noneFoundTitle")}
            description={t("friends.noneFoundDesc")}
          />
        )}

        {!loading &&
          usersList?.map((user: IUser) => {
            const invited = invitedIds.has(user.id);
            return (
              <UserCard key={user.id} user={user}>
                <UserActionBtn
                  handleFunction={handleInvite}
                  actionId={user.id}
                  icon={<FaUserPlus />}
                  color="green"
                  locked={invited}
                  title={
                    invited ? t("friends.inviteSent") : t("friends.addFriend")
                  }
                />
              </UserCard>
            );
          })}
      </div>
    </section>
  );
};

export default FriendsSearch;
