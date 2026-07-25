"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { api, socket } from "@/services";
import type { SendMessagePayload } from "@/types/message";
import type { ChatMessage } from "@/types/message";
import type {
  CreateGroupResponse,
  GroupListItem,
  GroupRoom,
  GroupRoomApi,
  PrivateRoom,
  PrivateRoomApi,
  RoomListResponse,
} from "@/types/room";
import type { SocketContextValue } from "@/types/socketContext";
import { toApiErrorState } from "@/types/api";
import { useRouter } from "next/navigation";

export type { ChatMessage as socketMessage } from "@/types/message";
export type { PrivateRoom as IPrivateRoom, GroupRoom as IGroupRoom } from "@/types/room";

type UsersOnline = { userId: string };

export const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([]);
  const [groupRooms, setGroupRooms] = useState<GroupRoom[]>([]);

  const { data: session } = useSession();
  const { push } = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  function isViewingRoom(roomId: string, friendUserId?: string) {
    const parts = window.location.pathname.split("/");
    if (parts[3] === "group" && parts[4] === roomId) {
      return true;
    }
    if (friendUserId && parts[3] === friendUserId) {
      return true;
    }
    return false;
  }

  function receiveMessage({ message, user, createdAt, roomId }: ChatMessage) {
    if (!roomId) return;

    setPrivateRooms((prevRooms) => {
      const roomIndex = prevRooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return prevRooms;
      const newRooms = [...prevRooms];
      newRooms[roomIndex] = {
        ...newRooms[roomIndex],
        messages: [
          ...newRooms[roomIndex].messages,
          { message, user, createdAt, roomId },
        ],
        notification: isViewingRoom(roomId, newRooms[roomIndex].user.id)
          ? newRooms[roomIndex].notification
          : newRooms[roomIndex].notification + 1,
      };
      return newRooms;
    });

    setGroupRooms((prevRooms) => {
      const roomIndex = prevRooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return prevRooms;
      const newRooms = [...prevRooms];
      newRooms[roomIndex] = {
        ...newRooms[roomIndex],
        messages: [
          ...newRooms[roomIndex].messages,
          { message, user, createdAt, roomId },
        ],
        notification: isViewingRoom(roomId)
          ? newRooms[roomIndex].notification
          : newRooms[roomIndex].notification + 1,
      };
      return newRooms;
    });
  }

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function friendsOnline(friends: UsersOnline[]) {
    setPrivateRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      friends.forEach((friend) => {
        const roomIndex = newRooms.findIndex(
          (room) => room.user.id === friend.userId
        );
        if (roomIndex !== -1) {
          newRooms[roomIndex].status = "online";
        }
      });
      return newRooms;
    });
  }

  function friendIsOnline({ userId }: UsersOnline) {
    setPrivateRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex((room) => room.user.id === userId);
      if (roomIndex !== -1) {
        newRooms[roomIndex].status = "online";
      }
      return newRooms;
    });
  }

  function friendIsOffline(data: UsersOnline) {
    setPrivateRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex(
        (room) => room.user.id === data.userId
      );
      if (roomIndex !== -1) {
        newRooms[roomIndex].status = "offline";
      }
      return newRooms;
    });
  }

  async function openRoomSocket(payload: {
    userId: string;
    roomId?: string;
    roomType?: string;
  }) {
    if (!session?.user.accessToken) return;

    if (payload.roomType === "group" && payload.roomId) {
      try {
        const response = await api.get<GroupRoom>(
          `api/room/group/${payload.roomId}`,
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
        const room = response.data;
        socket.emit("user:joinRoom", {
          room: room.id,
          token: session.user.accessToken,
        });
        setGroupRooms((prevRooms) => {
          if (prevRooms.some((r) => r.id === room.id)) return prevRooms;
          return [
            ...prevRooms,
            {
              ...room,
              notification: 1,
              messages: room.messages || [],
            },
          ];
        });
      } catch (error: unknown) {
        setError(toApiErrorState(error));
      }
      return;
    }

    try {
      const responseChat = await api.get<PrivateRoomApi>(
        `api/room/user?id=${payload.userId}`,
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      const room = responseChat.data;
      socket.emit("user:joinRoom", {
        room: room.id,
        token: session.user.accessToken,
      });
      setPrivateRooms((prevRooms) => {
        if (prevRooms.some((r) => r.id === room.id)) return prevRooms;
        return [
          ...prevRooms,
          {
            ...room,
            notification: 1,
            status: "online",
            messages: room.messages || [],
          },
        ];
      });
    } catch (error: unknown) {
      setError(toApiErrorState(error));
    }
  }

  useEffect(() => {
    socket.connect();

    return () => {
      socket.emit("disconnectUser", { userId: session?.user.sub });
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message:send", receiveMessage);
    socket.on("message:openRoom", openRoomSocket);
    socket.on("friend:listOnline", friendsOnline);
    socket.on("friend:isOnline", friendIsOnline);
    socket.on("friend:isOffline", friendIsOffline);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message:send", receiveMessage);
      socket.off("message:openRoom", openRoomSocket);
      socket.off("friend:listOnline", friendsOnline);
      socket.off("friend:isOnline", friendIsOnline);
      socket.off("friend:isOffline", friendIsOffline);
    };
  }, [session]);

  useEffect(() => {
    if (session?.user.accessToken) {
      socket.emit("user:register", {
        userId: session.user.sub,
        token: session.user.accessToken,
      });
      fetchChatList();
    }
  }, [session]);

  const fetchChatList = async () => {
    if (!session?.user.accessToken) return;

    try {
      const response = await api.get<RoomListResponse>("/api/room/list", {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      const data = response.data;

      const mappedPrivateRooms: PrivateRoom[] = data.privateRooms.map(
        (chat) => ({
          ...chat,
          notification: chat.notification ?? chat.notifications ?? 0,
          status: "offline",
          messages: chat.messages || [],
        })
      );
      const mappedGroupRooms: GroupRoom[] = (data.groupRooms || []).map(
        (chat: GroupRoomApi) => ({
          id: chat.id,
          name: chat.name,
          image: chat.image,
          users: chat.users || [],
          messages: chat.messages || [],
          notification: chat.notification || 0,
        })
      );

      const roomsId = [
        ...mappedPrivateRooms.map((room) => room.id),
        ...mappedGroupRooms.map((room) => room.id),
      ];

      setPrivateRooms(mappedPrivateRooms);
      setGroupRooms(mappedGroupRooms);
      socket.emit("user:ready", {
        userId: session.user.sub,
        activeRooms: roomsId,
        token: session.user.accessToken,
      });
    } catch {
      signOut({ redirect: true, callbackUrl: "/login" });
    }
  };

  const openRoom = async ({ userId }: { userId: string }) => {
    const roomExists = privateRooms.find((room) => room.user.id === userId);
    if (roomExists) {
      socket.emit("user:joinRoom", {
        room: roomExists.id,
        token: session?.user.accessToken,
      });
      push(`/me/chat/${userId}`);
    } else if (session?.user.accessToken) {
      try {
        const responseChat = await api.get<PrivateRoomApi>(
          `api/room/user?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
        const room = responseChat.data;
        socket.emit("user:joinRoom", {
          room: room.id,
          token: session.user.accessToken,
        });
        setPrivateRooms((prevRooms) => [
          ...prevRooms,
          {
            ...room,
            notification: 0,
            status: "offline",
            messages: room.messages || [],
          },
        ]);
        push(`/me/chat/${userId}`);
      } catch (error: unknown) {
        setError(toApiErrorState(error));
      }
    }
  };

  const openGroupRoom = async ({ roomId }: { roomId: string }) => {
    const roomExists = groupRooms.find((room) => room.id === roomId);
    if (roomExists) {
      socket.emit("user:joinRoom", {
        room: roomExists.id,
        token: session?.user.accessToken,
      });
      push(`/me/chat/group/${roomId}`);
      return;
    }

    if (!session?.user.accessToken) return;

    try {
      const response = await api.get<GroupRoom>(`api/room/group/${roomId}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      const room = response.data;
      socket.emit("user:joinRoom", {
        room: room.id,
        token: session.user.accessToken,
      });
      setGroupRooms((prev) => {
        if (prev.some((r) => r.id === room.id)) return prev;
        return [
          ...prev,
          {
            ...room,
            notification: room.notification || 0,
            messages: room.messages || [],
          },
        ];
      });
      push(`/me/chat/group/${roomId}`);
    } catch (error: unknown) {
      setError(toApiErrorState(error));
    }
  };

  const createGroup = async ({
    name,
  }: {
    name: string;
  }): Promise<CreateGroupResponse | null> => {
    if (!session?.user.accessToken) return null;
    const response = await api.post<CreateGroupResponse>(
      "api/room/group",
      { name },
      { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
    );
    const group = response.data;
    socket.emit("user:joinRoom", {
      room: group.id,
      token: session.user.accessToken,
    });
    setGroupRooms((prev) => [
      ...prev,
      {
        id: group.id,
        name: group.name,
        image: group.image,
        users: [
          {
            id: session.user.sub,
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.picture || "",
          },
        ],
        messages: [],
        notification: 0,
      },
    ]);
    return group;
  };

  const joinGroup = async ({
    roomId,
  }: {
    roomId: string;
  }): Promise<GroupRoom | null> => {
    if (!session?.user.accessToken) return null;
    const response = await api.post<GroupRoom>(
      `api/room/group/${roomId}/join`,
      {},
      { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
    );
    const room = response.data;
    socket.emit("user:joinRoom", {
      room: room.id,
      token: session.user.accessToken,
    });
    setGroupRooms((prev) => {
      if (prev.some((r) => r.id === room.id)) return prev;
      return [
        ...prev,
        {
          id: room.id,
          name: room.name,
          image: room.image,
          users: room.users || [],
          messages: room.messages || [],
          notification: room.notification || 0,
        },
      ];
    });
    push(`/me/chat/group/${roomId}`);
    return room;
  };

  const listGroups = async (): Promise<GroupListItem[]> => {
    if (!session?.user.accessToken) return [];
    const response = await api.get<GroupListItem[]>("api/room/group", {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    const data = response.data;
    return Array.isArray(data) ? data : [];
  };

  const searchGroups = async ({
    letters,
  }: {
    letters: string;
  }): Promise<GroupListItem[]> => {
    if (!session?.user.accessToken) return [];
    const response = await api.get<GroupListItem[] | GroupListItem>(
      `api/room/group/search?letters=${encodeURIComponent(letters || "")}`,
      {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data ? [data] : [];
  };

  const sendMessage = async ({ message, roomId }: SendMessagePayload) => {
    if (!session?.user.accessToken) return;
    try {
      socket.emit("message:send", {
        user: {
          id: session.user.sub,
          name: session.user.name,
          image: session.user.picture,
          token: session.user.accessToken,
        },
        message,
        roomId,
      });
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const fetchMessage = async ({ roomId }: { roomId: string }) => {
    if (!session?.user.accessToken) return;
    try {
      const response = await api.get<ChatMessage[]>(`api/message/${roomId}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const messages = [...response.data].reverse();

      setPrivateRooms((prevRooms) => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex((room) => room.id === roomId);
        if (roomIndex !== -1) {
          newRooms[roomIndex].messages = [...messages];
        }
        return newRooms;
      });

      setGroupRooms((prevRooms) => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex((room) => room.id === roomId);
        if (roomIndex !== -1) {
          newRooms[roomIndex].messages = [...messages];
        }
        return newRooms;
      });
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const closeRoom = async ({ roomId }: { roomId: string }) => {
    if (session?.user.accessToken) {
      try {
        await api.post(
          `api/room/${roomId}/close`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        setPrivateRooms((prevRooms) =>
          prevRooms.filter((room) => room.id !== roomId)
        );
        setGroupRooms((prevRooms) =>
          prevRooms.filter((room) => room.id !== roomId)
        );
      } catch (err: unknown) {
        console.log(err);
      }
    }
    push("/me/");
  };

  const resetPrivateNotificationCount = ({ roomId }: { roomId: string }) => {
    if (roomId === undefined) return;
    api.post(
      `api/notification/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );
    setPrivateRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex((room) => room.id === roomId);
      if (roomIndex !== -1) {
        newRooms[roomIndex].notification = 0;
      }
      return newRooms;
    });
    setGroupRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex((room) => room.id === roomId);
      if (roomIndex !== -1) {
        newRooms[roomIndex].notification = 0;
      }
      return newRooms;
    });
  };

  const value: SocketContextValue = {
    scrollToBottom,
    sendMessage,
    isConnected,
    socket,
    error,
    privateRooms,
    groupRooms,
    listRef,
    fetchMessage,
    closeRoom,
    fetchChatList,
    openRoom,
    openGroupRoom,
    createGroup,
    joinGroup,
    listGroups,
    searchGroups,
    setPrivateRooms,
    setGroupRooms,
    resetPrivateNotificationCount,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
