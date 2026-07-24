"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SocketContext } from "@/contexts/socketContext";
import CounterText from "../_ui/CounterText";
import { MdGroups, MdLogin } from "react-icons/md";
import UserActionBtn from "../_ui/buttons/UserActionBtn";

const searchSchema = yup.object().shape({
  letters: yup.string().required(),
});

const createSchema = yup.object().shape({
  name: yup.string().required().min(2),
});

type SearchGroupItem = {
  id: string;
  name: string;
  image: string | null;
  memberCount: number;
};

const GroupsPanel = () => {
  const { searchGroups, joinGroup, createGroup, openGroupRoom } =
    useContext(SocketContext);
  const [groupsList, setGroupsList] = useState<SearchGroupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchForm = useForm({
    resolver: yupResolver(searchSchema),
  });
  const createForm = useForm({
    resolver: yupResolver(createSchema),
  });

  const handleSearchSubmit = async (data: { letters: string }) => {
    setSearchError(null);
    setLoading(true);
    try {
      const results = await searchGroups({ letters: data.letters });
      setGroupsList(results || []);
    } catch (error: any) {
      setSearchError("Não foi possível buscar grupos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (data: { name: string }) => {
    setCreateError(null);
    setLoading(true);
    try {
      const group = await createGroup({ name: data.name });
      createForm.reset();
      if (group?.id) {
        openGroupRoom({ roomId: group.id });
      }
    } catch (error: any) {
      setCreateError("Não foi possível criar o grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (roomId: string) => {
    setLoading(true);
    try {
      await joinGroup({ roomId });
      setGroupsList((prev) => prev.filter((g) => g.id !== roomId));
    } catch (error: any) {
      setSearchError("Não foi possível entrar no grupo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-chatTitle text-xl font-semibold mb-3">Criar grupo</h2>
        <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
          <div className="flex">
            <input
              {...createForm.register("name")}
              placeholder="Nome do grupo"
              className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0 whitespace-nowrap"
            >
              Criar
            </button>
          </div>
          {createError && <p className="text-red-400 text-sm">{createError}</p>}
        </form>
      </div>

      <div>
        <h2 className="text-chatTitle text-xl font-semibold mb-3">Buscar grupos</h2>
        <form onSubmit={searchForm.handleSubmit(handleSearchSubmit)} className="mb-5">
          <div className="flex">
            <input
              {...searchForm.register("letters")}
              placeholder="Nome do grupo"
              className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0"
            >
              Buscar
            </button>
          </div>
          {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
        </form>

        <CounterText list={groupsList} text="Grupos encontrados" />

        <div className="space-y-2 mt-3">
          {groupsList.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between bg-chatBackground2 border border-chatBorder rounded p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chatBackground0 flex items-center justify-center text-chatTitle text-xl">
                  <MdGroups />
                </div>
                <div>
                  <p className="text-chatTitle font-semibold">{group.name}</p>
                  <p className="text-chatText text-sm">
                    {group.memberCount}{" "}
                    {group.memberCount === 1 ? "membro" : "membros"}
                  </p>
                </div>
              </div>
              <UserActionBtn
                handleFunction={handleJoin}
                actionId={group.id}
                icon={<MdLogin />}
                color="green"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroupsPanel;
