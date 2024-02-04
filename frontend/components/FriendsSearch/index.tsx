"use client";
import { UserSearchContext } from "@/contexts/userSearchContext";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUser } from "@/interfaces/friends";
import UserCard from "../_ui/UserCard";
import UserActionBtn from "../_ui/buttons/UserActionBtn";
import { FaUserPlus } from "react-icons/fa6";
import CounterText from "../_ui/CounterText";

const searchSchema = yup.object().shape({
  letters: yup.string().required(),
});

const FriendsSearch = () => {
  const { data: session } = useSession();
  const [letters, setLetters] = useState([]);
  const { searchUser, loading, error, usersList, inviteFriendUser } =
    useContext(UserSearchContext);

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(searchSchema),
  });

  useEffect(() => {
    if (session?.user.accessToken) {
    }
  }, []);

  const handleSearchSubmit = (e: any) => {
    searchUser(e);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(handleSearchSubmit)} className="mb-5">
        <div className="flex">
          <input
            {...register("letters")}
            className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1"
          ></input>
          <button
            type="submit"
            className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0"
          >
            Buscar
          </button>
        </div>
      </form>

      <div>
        <CounterText list={usersList} text="Usuários encontrados" />

        {usersList?.map((user: IUser) => (
          <UserCard key={user.id} user={user}>
            <UserActionBtn
              handleFunction={inviteFriendUser}
              actionId={user.id}
              icon={<FaUserPlus />}
              color="green"
            />
          </UserCard>
        ))}
      </div>
    </section>
  );
};

export default FriendsSearch;
