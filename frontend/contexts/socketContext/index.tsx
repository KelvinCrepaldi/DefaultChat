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
import { useParams, useRouter } from "next/navigation";

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
}

export type IUser = {
  id?: string;
  email: string;
  name: string;
  picture: string;
  image: string;
}

export type IGroupRoom = {
  id:string,
  type: string //group or private
  image: string;
  title: string;
  messages:socketMessage[],
  notification: number,
  users:[
    {
      id?: string;
      email: string;
      name: string;
      picture: string;
      image: string;
    }
  ]
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

interface IUsersOnline {
  socketId: string,
  userEmail:string
}

export const SocketContext = createContext<any>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [privateRooms, setPrivateRooms] = useState<IPrivateRoom[]>([]);

  const { data: session } = useSession();
  const { push } = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  function receiveMessage({ message, user, createdAt, roomId }: socketMessage) {
    setPrivateRooms(prevRooms => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex(room => room.id === roomId);
      if (roomIndex !== -1) {
        newRooms[roomIndex].messages = [...newRooms[roomIndex].messages,
           {message, user, createdAt, roomId}
        ]
        const path = window.location.pathname.split("/")[3]
        if(path !== newRooms[roomIndex].user.id){
          newRooms[roomIndex].notification = newRooms[roomIndex].notification + 1
        }
      }
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
        const roomIndex = newRooms.findIndex((room)=> room.user.email === friend.userEmail)
        if(roomIndex !== -1){
          newRooms[roomIndex].status = "online"
        }
      })
      return newRooms
    });
  }

  function friendIsOnline(data: any){
      setPrivateRooms(prevRooms => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex(room => room.user.email === data.userEmail);
        if (roomIndex !== -1) {
          newRooms[roomIndex].status = "online";
        }
        return newRooms;
      });
  }

  

  function friendIsOffline(data: any){
    setPrivateRooms(prevRooms => {
      const newRooms = [...prevRooms];
      const roomIndex = newRooms.findIndex(room => room.user.email === data.userEmail);
      if (roomIndex !== -1) {
        newRooms[roomIndex].status = "offline";
      }
      return newRooms;
    });
  }

  useEffect(() => {
    socket.connect();

    return () => {
      socket.emit("disconnectUser", {userEmail: session?.user.email})
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
  

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("send_message", receiveMessage);
    socket.on("friendsOnline", friendsOnline);
    socket.on("friendIsOnline", friendIsOnline);
    socket.on("friendIsOffline", friendIsOffline);
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

      const privateRooms = data.privateRooms.map((chat: IPrivateRoomRequest) =>{
        return {
          ...chat,
          status: 'offline'
        }
      })
      const roomsId = privateRooms.map((room: IPrivateRoomRequest)=> room.id)
      
      setPrivateRooms(privateRooms);
      //criar logica de grupos usando data.groupRooms
      socket.emit("userListReady", {userEmail: session?.user.email, activeRooms: roomsId})
    } catch (error) {
      console.log(error);
    } 
  };

  const openRoom = async ({userId} : {userId: string}) =>{
    const roomExists = privateRooms.find((room)=> room.user.id === userId)
    if(roomExists){
      socket.emit("join_room", { room: roomExists.id });
      push(`/me/chat/${userId}`)
    } else{
      if (session?.user.accessToken) {
        try {
          const responseChat = await api.get(`api/room/user?id=${userId}`, {
            headers: { Authorization: `Bearer ${session?.user.accessToken}` },
          });
          const room = responseChat.data;
          socket.emit("join_room", { room: room.id });
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

  /* const leaveRoom = async ({roomId} : {roomId: string}) => {
    socket.emit("leaveRoom", { room: roomId });
  }; */

  const sendMessage = async ({ message , roomId }: ISendMessage) => {
    if (session?.user.accessToken) {
      try{
        socket.emit("send_message", {
          user: { 
            id: session.user.id,
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
        setPrivateRooms(prevRooms => {
          const filterRooms = prevRooms.filter((room) => room.id !== roomId);
          return filterRooms;
        });
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
        listRef,
        fetchMessage,
        closeRoom,
        fetchChatList,
        openRoom,
        setPrivateRooms,
        resetPrivateNotificationCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
