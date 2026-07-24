"use client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SocketContext } from "@/contexts/socketContext";
import CounterText from "../_ui/CounterText";
import EmptyState from "../_ui/EmptyState";
import Loading from "../_ui/Loading";
import { MdGroups, MdLogin, MdOpenInNew } from "react-icons/md";
import UserActionBtn from "../_ui/buttons/UserActionBtn";

const searchSchema = yup.object().shape({
  letters: yup.string().default(""),
});

const createSchema = yup.object().shape({
  name: yup.string().required().min(2),
});

type GroupListItem = {
  id: string;
  name: string;
  image: string | null;
  memberCount: number;
  isMember?: boolean;
};

const GroupsPanel = () => {
  const { searchGroups, joinGroup, createGroup, openGroupRoom, listGroups } =
    useContext(SocketContext);
  const [availableGroups, setAvailableGroups] = useState<GroupListItem[]>([]);
  const [searchResults, setSearchResults] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [searchCooldown, setSearchCooldown] = useState(false);
  const [createCooldown, setCreateCooldown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const searchForm = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: { letters: "" },
  });
  const createForm = useForm({
    resolver: yupResolver(createSchema),
  });

  const loadGroups = async () => {
    setListError(null);
    setListLoading(true);
    try {
      const results = await listGroups();
      setAvailableGroups(results || []);
    } catch (error: any) {
      setListError("Não foi possível carregar os grupos.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleSearchSubmit = async (data: { letters?: string }) => {
    if (loading || searchCooldown) return;
    setSearchError(null);
    setHasSearched(true);
    setLoading(true);
    setSearchCooldown(true);
    try {
      const results = await searchGroups({ letters: data.letters || "" });
      setSearchResults(results || []);
    } catch (error: any) {
      setSearchError("Não foi possível buscar grupos.");
    } finally {
      setLoading(false);
      setTimeout(() => setSearchCooldown(false), 1000);
    }
  };

  const handleCreateSubmit = async (data: { name: string }) => {
    if (loading || createCooldown) return;
    setCreateError(null);
    setLoading(true);
    setCreateCooldown(true);
    try {
      const group = await createGroup({ name: data.name });
      createForm.reset();
      await loadGroups();
      if (group?.id) {
        openGroupRoom({ roomId: group.id });
      }
    } catch (error: any) {
      setCreateError("Não foi possível criar o grupo.");
    } finally {
      setLoading(false);
      setTimeout(() => setCreateCooldown(false), 1000);
    }
  };

  const handleJoin = async (roomId: string) => {
    setLoading(true);
    try {
      await joinGroup({ roomId });
      setSearchResults((prev) => prev.filter((g) => g.id !== roomId));
      await loadGroups();
    } catch (error: any) {
      setSearchError("Não foi possível entrar no grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (roomId: string) => {
    openGroupRoom({ roomId });
  };

  const renderGroupRow = (
    group: GroupListItem,
    action: "join" | "open" | "both"
  ) => (
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
            {group.isMember ? " · você está neste grupo" : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {(action === "open" || (action === "both" && group.isMember)) && (
          <UserActionBtn
            handleFunction={handleOpen}
            actionId={group.id}
            icon={<MdOpenInNew />}
            color="blue"
            title="Abrir grupo"
          />
        )}
        {(action === "join" || (action === "both" && !group.isMember)) && (
          <UserActionBtn
            handleFunction={handleJoin}
            actionId={group.id}
            icon={<MdLogin />}
            color="green"
            title="Entrar no grupo"
          />
        )}
      </div>
    </div>
  );

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
              disabled={loading || createCooldown}
              className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Criar
            </button>
          </div>
          {createError && <p className="text-red-400 text-sm">{createError}</p>}
        </form>
      </div>

      <div>
        <h2 className="text-chatTitle text-xl font-semibold mb-3">
          Grupos disponíveis
        </h2>
        {listError && <p className="text-red-400 text-sm mb-2">{listError}</p>}
        <CounterText list={availableGroups} text="grupos" />
        {listLoading ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <div className="space-y-2 mt-3">
            {availableGroups.length === 0 && !listError && (
              <EmptyState
                className="py-10"
                title="Nenhum grupo disponível"
                description="Ainda não existem grupos públicos. Crie o primeiro grupo acima para outras pessoas poderem entrar."
              />
            )}
            {availableGroups.map((group) => renderGroupRow(group, "both"))}
          </div>
        )}
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
              disabled={loading || searchCooldown}
              className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
          </div>
          {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
        </form>

        <CounterText list={searchResults} text="Grupos encontrados" />

        {loading && hasSearched ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <div className="space-y-2 mt-3">
            {!hasSearched && (
              <EmptyState
                className="py-8"
                title="Busque um grupo"
                description="Digite o nome de um grupo e clique em Buscar para encontrar salas em que você ainda não entrou."
              />
            )}
            {hasSearched && searchResults.length === 0 && (
              <EmptyState
                className="py-8"
                title="Nenhum grupo encontrado"
                description="Nenhum resultado para essa busca. Tente outro nome ou crie um grupo novo."
              />
            )}
            {searchResults.map((group) => renderGroupRow(group, "join"))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GroupsPanel;
