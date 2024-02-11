"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { IRoom, SocketContext, socketMessage } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import Loading from "../_ui/Loading";
import Message from "../_ui/Message";

export default function Chat({ roomId }: { roomId: string }) {
  const {
    sendMessage,
    joinRoom,
    rooms,
    error,
    clearNotification
  } = useContext(SocketContext);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const room: IRoom = rooms?.filter((room: IRoom) => room.user.id === roomId)[0]
  const divRef = useRef<HTMLDivElement>(null)

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (session?.user && room) sendMessage({ message, user: session?.user, roomId: room.id });
    setMessage("");
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    joinRoom(roomId);
  }, [session]);

  useEffect(() => {
    if(divRef.current){
      divRef.current.scrollIntoView()
    }
    
  },[rooms])

  if (!room) {
    return <Loading />;
  }

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col">

      <div
        className="m-2 p-2 rounded overflow-y-auto flex flex-col grow"
      >
        {room.messages?.map((msg: socketMessage, index: number) => (
          <Message msg={msg} key={index} />
        ))}
        <div ref={divRef}></div>
        <div>{error}</div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="w-full m-1 p-1 bg-slate-300 rounded"
        ></input>
        <button className="bg-gray-700 m-1 p-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}
