"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, socket } from "@/services";
import { IRoom } from "@/interfaces/room";
import { ISendMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/friends";

export const SocketContext = createContext<any>(undefined);

export type socketMessage = {
  user: IUser;
  message: string;
  createdAt: Date;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<socketMessage[]>([]);
  const [error, setError] = useState<IErrorResponse | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { data: session } = useSession();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function receiveMessage({ message, user, createdAt }: socketMessage) {
      setMessages((prevMessages: socketMessage[]) => [
        ...prevMessages,
        { message, user, createdAt },
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("send_message", receiveMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("send_message", receiveMessage);
    };
  }, []);

  const joinRoom = async (id: string) => {
    if (session?.user.accessToken) {
      try {
        setMessages([]);
        const response = await api.get(`api/room/user?id=${id}`, {
          headers: { Authorization: `Bearer ${session?.user.accessToken}` },
        });

        const data: IRoom = response.data;
        setRoom(data);
        socket.emit("join_room", { room: data.id });
      } catch (error: any) {
        setError(error.code);
      }
    }
  };

  const sendMessage = ({ message, user }: ISendMessage) => {
    console.log(messages);
    socket.emit("send_message", {
      user: { name: user.name, email: user.email, image: user.picture },
      message,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        isConnected,
        messages,
        socket,
        joinRoom,
        room,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
