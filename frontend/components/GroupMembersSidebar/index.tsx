"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaUserPlus } from "react-icons/fa6";
import UserAvatar from "../_ui/UserAvatar";
import { api } from "@/services";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type GroupMembersSidebarProps = {
  members: Member[];
};

const MemberCard = ({ member }: { member: Member }) => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isSelf = session?.user?.sub === member.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const sendFriendInvite = async () => {
    if (!session?.user.accessToken || isSelf) return;
    setFeedback(null);
    try {
      await api.post(
        `api/friend/${member.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      setFeedback("Convite enviado");
      setMenuOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Não foi possível enviar o convite";
      setFeedback(typeof message === "string" ? message : "Erro ao enviar convite");
      setMenuOpen(false);
    }
  };

  return (
    <div className="relative bg-chatBackground1 hover:bg-chatBackground2 rounded-l py-2 px-2 mb-[2px] transition-all">
      <div className="flex items-center gap-2">
        <UserAvatar name={member.name} image={member.image} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-chatTitle font-semibold truncate text-sm">
            {member.name}
            {isSelf ? " (você)" : ""}
          </p>
          <p className="text-chatText text-xs truncate">{member.email}</p>
          {feedback && (
            <p className="text-[11px] text-chatTitle mt-0.5">{feedback}</p>
          )}
        </div>
        {!isSelf && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-chatText hover:text-chatTextWhite p-1 rounded"
              aria-label="Opções do membro"
            >
              <HiDotsHorizontal />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 min-w-[180px] bg-chatBackground2 border border-chatBorder rounded shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={sendFriendInvite}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-chatTextWhite hover:bg-chatBackground1"
                >
                  <FaUserPlus className="text-chatTitle" />
                  Enviar convite de amizade
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GroupMembersSidebar = ({ members }: GroupMembersSidebarProps) => {
  return (
    <aside className="w-[250px] min-w-[220px] max-w-[250px] h-full bg-chatBackground0 border-l border-chatBorder flex flex-col overflow-hidden">
      <div className="p-3 border-b border-chatBorder">
        <h2 className="text-chatTitle font-semibold">Membros</h2>
        <p className="text-chatText text-xs">{members.length} no grupo</p>
      </div>
      <div className="overflow-y-auto grow p-2">
        {members.length === 0 && (
          <p className="text-chatText text-sm p-2">Nenhum membro listado.</p>
        )}
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </aside>
  );
};

export default GroupMembersSidebar;
