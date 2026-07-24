"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaUserPlus } from "react-icons/fa6";
import UserAvatar from "../_ui/UserAvatar";
import { api } from "@/services";
import { FriendsContext, FriendsContextType } from "@/contexts/friendsContext";
import { useContext } from "react";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type GroupMembersSidebarProps = {
  members: Member[];
};

const MemberCard = ({
  member,
  invitedIds,
  onInviteSent,
}: {
  member: Member;
  invitedIds: Set<string>;
  onInviteSent: (userId: string) => void;
}) => {
  const { data: session } = useSession();
  const friendsContext = useContext(FriendsContext) as FriendsContextType | null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isSelf = session?.user?.sub === member.id;

  const isFriend = friendsContext?.friends?.some(
    (f) => f.addressee?.id === member.id
  );
  const alreadyInvited = invitedIds.has(member.id) || !!isFriend;

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
    if (!session?.user.accessToken || isSelf || alreadyInvited || sending || cooldown) {
      return;
    }
    setSending(true);
    setCooldown(true);
    try {
      await api.post(
        `api/friend/${member.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      onInviteSent(member.id);
      setMenuOpen(false);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 409) {
        onInviteSent(member.id);
      }
      setMenuOpen(false);
    } finally {
      setSending(false);
      setTimeout(() => setCooldown(false), 1000);
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
          {alreadyInvited && !isSelf && !isFriend && (
            <p className="text-[11px] text-chatText mt-0.5">Convite já enviado</p>
          )}
          {isFriend && !isSelf && (
            <p className="text-[11px] text-chatText mt-0.5">Já é seu amigo</p>
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
              <div className="absolute right-0 top-7 z-20 min-w-[200px] bg-chatBackground2 border border-chatBorder rounded shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={sendFriendInvite}
                  disabled={alreadyInvited || sending || cooldown}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-chatTextWhite hover:bg-chatBackground1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-chatBackground2"
                >
                  <FaUserPlus className="text-chatTitle shrink-0" />
                  {alreadyInvited
                    ? isFriend
                      ? "Já é seu amigo"
                      : "Convite já enviado"
                    : sending
                      ? "Enviando..."
                      : "Adicionar amizade"}
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
  const { data: session } = useSession();
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

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
        // ignore
      }
    };
    loadSent();
  }, [session?.user.accessToken]);

  const handleInviteSent = (userId: string) => {
    setInvitedIds((prev) => new Set(prev).add(userId));
  };

  return (
    <aside className="w-[250px] min-w-[220px] max-w-[250px] h-full bg-chatBackground0 border-l border-chatBorder flex flex-col overflow-hidden">
      <div className="p-3 border-b border-chatBorder">
        <h2 className="text-chatTitle font-semibold">Membros</h2>
        <p className="text-chatText text-xs">{members.length} no grupo</p>
      </div>
      <div className="overflow-y-auto grow p-2">
        {members.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center px-3 py-10">
            <p className="text-chatTitle text-sm font-semibold mb-1">
              Sem membros
            </p>
            <p className="text-chatText text-xs leading-relaxed">
              Os membros do grupo aparecem aqui quando a sala carregar.
            </p>
          </div>
        )}
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            invitedIds={invitedIds}
            onInviteSent={handleInviteSent}
          />
        ))}
      </div>
    </aside>
  );
};

export default GroupMembersSidebar;
