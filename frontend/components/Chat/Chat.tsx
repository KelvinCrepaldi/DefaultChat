"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { IPrivateRoom, SocketContext, socketMessage } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import Loading from "../_ui/Loading";
import Message from "../_ui/Message";
import { useParams } from "next/navigation";

export default function Chat() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId
  const {
    sendMessage,
    joinRoom,
    privateRooms,
    error,
    fetchMessage,
    clearNotification
  } = useContext(SocketContext);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const divRef = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState<IPrivateRoom | null>(null)


  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (session?.user && room) sendMessage({ message, roomId: room.id });
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

  useEffect(()=>{
    if(room)fetchMessage({roomId: room.id})
  },[room])

  useEffect(() => {
    if(divRef.current){
      divRef.current.scrollIntoView()
    }
    setRoom(privateRooms?.filter((room: IPrivateRoom) => room.user.id === roomId)[0])
  },[privateRooms])

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col">
      <div
        className="m-2 p-2 rounded overflow-y-auto flex flex-col grow"
      >
        {room?.messages?.map((msg: any, index: number) => (
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
