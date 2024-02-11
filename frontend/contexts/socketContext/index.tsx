"use client";

import {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { api, socket } from "@/services";
import { ISendMessage } from "@/interfaces/message";

export const SocketContext = createContext<any>(undefined);

export type socketMessage = {
  user: IUser;
  message: string;
  createdAt: Date;
  roomId: string;
};

export type IChat = {
  id: string,
  user: {
    id: string
    name: string,
    email: string,
    image:string;
  },
}

export type IUser = {
  id?: string;
  email: string;
  username: string;
  picture: string;
}

export type IRoom = {
  id:string
  user:{
    id: string;
    name: string
    email: string
    image: string
  },
  messages:socketMessage[],
  notification: number,
  status: string
}

interface IUsersOnline {
  socketId: string,
  userEmail:string
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>("")
  const { data: session } = useSession();

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.connect();

    return () => {
      socket.emit("disconnectUser", {userEmail: session?.user.email})
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onConnect() {
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function friendsOnline(friends: IUsersOnline[]){
      setRooms(prevRooms => {
        const newRooms = [...prevRooms]
        friends.forEach((friend)=> {
          const roomIndex = newRooms.findIndex((room)=> room.user.email === friend.userEmail)
          if(roomIndex !== -1){
            newRooms[roomIndex].status = "online"
          }
        })
        
        return newRooms
      });
    }

    function friendIsOnline(data: any){
        setRooms(prevRooms => {
          const newRooms = [...prevRooms];
          const roomIndex = newRooms.findIndex(room => room.user.email === data.userEmail);
          if (roomIndex !== -1) {
            newRooms[roomIndex].status = "online";
          }
          return newRooms;
        });
    }

    function receiveMessage({ message, user, createdAt, roomId }: socketMessage) {
      console.log(message)
    }

    function friendIsOffline(data: any){
      console.log("usuário desconectou-se:",data)
    }

   

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("send_message", receiveMessage);
    socket.on("friendsOnline", friendsOnline);
    socket.on("friendIsOnline", friendIsOnline);
    socket.off("friendIsOffline", friendIsOffline);

    return () => {
      
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("send_message", receiveMessage);
      socket.off("friendsOnline", friendsOnline);
      socket.off("friendIsOnline", friendIsOnline);
      socket.off("friendIsOffline", friendIsOffline);
    };
  }, []);

  useEffect(()=>{
    if (session?.user.accessToken) {
      socket.emit('registerUser', {userEmail: session.user.email})
      fetchChatList();
    }
  },[session])

  const fetchChatList = async () => {
    try {
      const response = await api.get("/api/room/list", {
        headers: { Authorization: `Bearer ${session?.user.accessToken}` },
      });
      const data = response.data;

      const newChatData = data.map((chat: IChat) =>{
        return {
          ...chat,
          messages:[],
          notification: 0,
          status: 'offline'
        }
      })
      setRooms(newChatData);
    } catch (error) {
      console.log(error);
    } finally{
      socket.emit("userListReady", {userEmail: session?.user.email})
    }
  };

  const joinRoom = async (id: string) => {
    if (session?.user.accessToken) {
      try {
        const response = await api.get(`api/room/user?id=${id}`, {
          headers: { Authorization: `Bearer ${session?.user.accessToken}` },
        });
        const data: IRoom = response.data;
        // fazer fetch das mensagens da room?
        setActiveRoom(data.id)
        fetchChatList();
        socket.emit("join_room", { room: data.id });
      } catch (error: any) {
        setError(error.code);
      }
    }
  };

  const sendMessage = ({ message, user, roomId }: ISendMessage) => {
    socket.emit("send_message", {
      user: { name: user.name, email: user.email, image: user.picture },
      message,
      roomId
    });
  };

  return (
    <SocketContext.Provider
      value={{
        scrollToBottom,
        sendMessage,
        isConnected,
        socket,
        joinRoom,
        error,
        rooms,
        activeRoom,
        listRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
