"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { api, socket } from "@/services";
import { IRoom } from "@/interfaces/room";
import { ISendMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/friends";
import {
  ActiveChatContext,
  activeChatContextType,
} from "../activeChatsContext";

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
  const [list, setList] = useState<string[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const { chatList, fetchChatList } = useContext(
    ActiveChatContext
  ) as activeChatContextType;
  const { data: session } = useSession();

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

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
        fetchChatList();
        socket.emit("join_room", { room: data.id });
      } catch (error: any) {
        setError(error.code);
      }
    }
  };

  const sendMessage = ({ message, user }: ISendMessage) => {
    socket.emit("send_message", {
      user: { name: user.name, email: user.email, image: user.picture },
      message,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        scrollToBottom,
        sendMessage,
        isConnected,
        messages,
        socket,
        joinRoom,
        room,
        error,
        listRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
