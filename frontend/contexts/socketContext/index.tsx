"use client";

import {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { api, socket } from "@/services";
import { ISendMessage } from "@/interfaces/message";
import { useRouter } from "next/navigation";

export type socketMessage = {
  user: IUser;
  message: string;
  createdAt: Date;
  roomId: string;
};

export type IPrivateRoomRequest = {
  id: string,
  name: string,
  image: string,
  user: {
    id: string
    name: string,
    email: string,
    image:string;
  },
  notifications: number,
  messages: any[]
}

export type IGroupRoomRequest = {
  id: string,
  name: string,
  image: string,
  users: {
    id: string
    name: string,
    email: string,
    image:string;
  }[],
  messages: any[],
  notification: number,
}

export type IUser = {
  id?: string;
  email: string;
  name: string;
  picture: string;
  image: string;
}

export type IPrivateRoom = {
  id:string
  name: string;
  image: string;
  user:{
    id: string;
    name: string
    email: string
    image: string
  },
  notification: number,
  status: string,
  messages:socketMessage[],
}

export type IGroupRoom = {
  id: string;
  name: string;
  image: string;
  users: {
    id: string;
    name: string;
    email: string;
    image: string;
  }[];
  notification: number;
  messages: socketMessage[];
}

interface IUsersOnline {
  userId: string;
}

export const SocketContext = createContext<any>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [privateRooms, setPrivateRooms] = useState<IPrivateRoom[]>([]);
  const [groupRooms, setGroupRooms] = useState<IGroupRoom[]>([]);

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
    // /me/chat/group/[roomId]
    if (parts[3] === "group" && parts[4] === roomId) {
      return true;
    }
    // /me/chat/[userId]
    if (friendUserId && parts[3] === friendUserId) {
      return true;
    }
    return false;
  }

  function receiveMessage({ message, user, createdAt, roomId }: socketMessage) {
    setPrivateRooms(prevRooms => {
      const roomIndex = prevRooms.findIndex(room => room.id === roomId);
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

    setGroupRooms(prevRooms => {
      const roomIndex = prevRooms.findIndex(room => room.id === roomId);
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

  function friendsOnline(friends: IUsersOnline[]){
    setPrivateRooms(prevRooms => {
      const newRooms = [...prevRooms]
      friends.forEach((friend)=> {
        const roomIndex = newRooms.findIndex((room)=> room.user.id === friend.userId)
        if(roomIndex !== -1){
          newRooms[roomIndex].status = "online"
        }
      })
      return newRooms
    });
  }

  function friendIsOnline({userId}: IUsersOnline){
      setPrivateRooms(prevRooms => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex(room => room.user.id === userId);
        if (roomIndex !== -1) {
          newRooms[roomIndex].status = "online";
        }
        return newRooms;
      });
  }

  function friendIsOffline(data: IUsersOnline){
    setPrivateRooms(prevRooms => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex(room => room.user.id === data.userId);
      if (roomIndex !== -1) {
        newRooms[roomIndex].status = "offline";
      }
      return newRooms;
    });
  }

  async function openRoomSocket(payload: {userId: string, roomId?: string, roomType?: string}) {
    if (!session?.user.accessToken) return;

    if (payload.roomType === "group" && payload.roomId) {
      try {
        const response = await api.get(`api/room/group/${payload.roomId}`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        const room = response.data;
        socket.emit("user:joinRoom", { room: room.id, token: session.user.accessToken });
        setGroupRooms(prevRooms => {
          if (prevRooms.some(r => r.id === room.id)) return prevRooms;
          return [...prevRooms, {
            ...room,
            notification: 1,
            messages: room.messages || [],
          }];
        });
      } catch (error: any) {
        setError(error.code);
      }
      return;
    }

    try {
      const responseChat = await api.get(`api/room/user?id=${payload.userId}`, {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
      const room = responseChat.data;
      socket.emit("user:joinRoom", { room: room.id, token: session.user.accessToken });
      setPrivateRooms(prevRooms => {
        if (prevRooms.some(r => r.id === room.id)) return prevRooms;
        return [...prevRooms, {
          ...room,
          notification: 1,
          status: 'online'
        }];
      });
    } catch (error: any) {
      setError(error.code);
    }
  }

  useEffect(() => {
    socket.connect();

    return () => {
      socket.emit("disconnectUser", {userId: session?.user.sub})
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
      socket.off("message:openRoom", openRoomSocket)
      socket.off("friend:listOnline", friendsOnline);
      socket.off("friend:isOnline", friendIsOnline);
      socket.off("friend:isOffline", friendIsOffline);
    };
  }, [session]);

  useEffect(()=>{
    if (session?.user.accessToken) {
      socket.emit('user:register', {userId: session.user.sub, token: session.user.accessToken})
      fetchChatList();
    }
  },[session])

  const fetchChatList = async () => {
    try {
      const response = await api.get("/api/room/list", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
      const data = response.data;
      
      const mappedPrivateRooms = data.privateRooms.map((chat: IPrivateRoomRequest) =>{
        return {
          ...chat,
          status: 'offline'
        }
      })
      const mappedGroupRooms: IGroupRoom[] = (data.groupRooms || []).map((chat: IGroupRoomRequest) => ({
        id: chat.id,
        name: chat.name,
        image: chat.image,
        users: chat.users || [],
        messages: chat.messages || [],
        notification: chat.notification || 0,
      }))

      const roomsId = [
        ...mappedPrivateRooms.map((room: IPrivateRoomRequest)=> room.id),
        ...mappedGroupRooms.map((room) => room.id),
      ]
      
      setPrivateRooms(mappedPrivateRooms);
      setGroupRooms(mappedGroupRooms);
      socket.emit("user:ready", {userId: session?.user.sub, activeRooms: roomsId, token: session.user.accessToken})
    } catch (error) {
        signOut({redirect: true, callbackUrl: "/login"});
    } 
  };

  const openRoom = async ({userId} : {userId: string}) =>{
    const roomExists = privateRooms.find((room)=> room.user.id === userId)
    if(roomExists){
      socket.emit("user:joinRoom", { room: roomExists.id, token: session?.user.accessToken });
      push(`/me/chat/${userId}`)
    } else{
      if (session?.user.accessToken) {
        try {
          const responseChat = await api.get(`api/room/user?id=${userId}`, {
            headers: { Authorization: `Bearer ${session?.user.accessToken}` },
          });
          const room = responseChat.data;
          socket.emit("user:joinRoom", { room: room.id, token: session.user.accessToken });
          setPrivateRooms(prevRooms => {
            return [...prevRooms, {
              ...room,
              notification: 0,
              status: 'offline'
            }];
          });
        
          push(`/me/chat/${userId}`)
        } catch (error: any) {
          setError(error.code);
        }
      }
    }
  }

  const openGroupRoom = async ({ roomId }: { roomId: string }) => {
    const roomExists = groupRooms.find((room) => room.id === roomId);
    if (roomExists) {
      socket.emit("user:joinRoom", { room: roomExists.id, token: session?.user.accessToken });
      push(`/me/chat/group/${roomId}`);
      return;
    }

    if (!session?.user.accessToken) return;

    try {
      const response = await api.get(`api/room/group/${roomId}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      const room = response.data;
      socket.emit("user:joinRoom", { room: room.id, token: session.user.accessToken });
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
    } catch (error: any) {
      setError(error.code);
    }
  };

  const createGroup = async ({ name }: { name: string }) => {
    if (!session?.user.accessToken) return null;
    const response = await api.post(
      "api/room/group",
      { name },
      { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
    );
    const group = response.data;
    socket.emit("user:joinRoom", { room: group.id, token: session.user.accessToken });
    setGroupRooms((prev) => [
      ...prev,
      {
        id: group.id,
        name: group.name,
        image: group.image,
        users: [
          {
            id: session.user.sub as string,
            name: session.user.name || "",
            email: session.user.email || "",
            image: (session.user.picture as string) || "",
          },
        ],
        messages: [],
        notification: 0,
      },
    ]);
    return group;
  };

  const joinGroup = async ({ roomId }: { roomId: string }) => {
    if (!session?.user.accessToken) return null;
    const response = await api.post(
      `api/room/group/${roomId}/join`,
      {},
      { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
    );
    const room = response.data;
    socket.emit("user:joinRoom", { room: room.id, token: session.user.accessToken });
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

  const searchGroups = async ({ letters }: { letters: string }) => {
    if (!session?.user.accessToken) return [];
    const response = await api.get(`api/room/group/search?letters=${encodeURIComponent(letters)}`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    return response.data;
  };

  const sendMessage = async ({ message , roomId }: ISendMessage) => {
    if (session?.user.accessToken) {
      
      try{
        socket.emit("message:send", {
          user: { 
            id: session.user.sub,
            name: session.user.name,
            image: session.user.picture ,
            token: session.user.accessToken
          },
          message,
          roomId,
        });
      }catch(error){
        console.log(error)
      }
    }
  };

  const fetchMessage = async ({roomId}: {roomId : string}) =>{
    if (session?.user.accessToken) {
      try {
        const response = await api.get(`api/message/${roomId}`, {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`
          }
        })
        const messages = response.data.reverse();
  
        setPrivateRooms(prevRooms => {
          const newRooms = [...prevRooms];
          const roomIndex = newRooms.findIndex(room => room.id === roomId);
          if (roomIndex !== -1) {
            newRooms[roomIndex].messages = [...messages];
          }
          return newRooms;
        });

        setGroupRooms(prevRooms => {
          const newRooms = [...prevRooms];
          const roomIndex = newRooms.findIndex(room => room.id === roomId);
          if (roomIndex !== -1) {
            newRooms[roomIndex].messages = [...messages];
          }
          return newRooms;
        });
      } catch (error) {
        console.log(error)
      }
    }
  }

  const closeRoom = async ({roomId}: {roomId: string}) =>{
    if (session?.user.accessToken) {
      try {
        await api.post(`api/room/${roomId}/close`,{}, {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`
          }
        })
        setPrivateRooms(prevRooms => prevRooms.filter((room) => room.id !== roomId));
        setGroupRooms(prevRooms => prevRooms.filter((room) => room.id !== roomId));
      } catch (error) {
        console.log(error)
      }
    }
    push("/me/")
  }

  const resetPrivateNotificationCount = ({roomId}: {roomId: string}) =>{
    if(roomId !== undefined){
      api.post(`api/notification/${roomId}`,{}, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`
        }
      })
      setPrivateRooms(prevRooms => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex((room)=> room.id === roomId);
        if(roomIndex !== -1){
          newRooms[roomIndex].notification = 0;
        }
        return newRooms
      })
      setGroupRooms(prevRooms => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex((room)=> room.id === roomId);
        if(roomIndex !== -1){
          newRooms[roomIndex].notification = 0;
        }
        return newRooms
      })
    }
  }

  return (
    <SocketContext.Provider
      value={{
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
        searchGroups,
        setPrivateRooms,
        setGroupRooms,
        resetPrivateNotificationCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
