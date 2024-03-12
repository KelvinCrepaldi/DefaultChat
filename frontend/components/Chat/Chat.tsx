"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { IPrivateRoom, SocketContext, socketMessage } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import Message from "../_ui/Message";
import { useParams } from "next/navigation";
import ChatHeader from "../ChatHeader";

export default function Chat() {
  const { roomId } = useParams() as { roomId: string | null };
  const {
    sendMessage,
    privateRooms,
    error,
    resetPrivateNotificationCount,
  } = useContext(SocketContext);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const divRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null);
  const room = privateRooms?.filter((room: IPrivateRoom) => room.user.id === roomId)[0]

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (session?.user ) sendMessage({ message, roomId: room?.id });
    setMessage("");
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(()=>{
    resetPrivateNotificationCount({roomId: room?.id})
  },[])

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if(divRef.current){
      divRef.current.scrollIntoView()
    }
    // setRoom(privateRooms?.filter((room: IPrivateRoom) => room.user.id === roomId)[0])
    
  },[privateRooms, roomId])

  return (
    <section className=" p-2 bg-chatBackground2  w-full h-full m-auto flex flex-col">
      {room && <ChatHeader room={room} />}
      <div
        className="m-2 p-2 rounded overflow-y-auto flex flex-col grow"
      >
        {room?.messages?.map((msg: any, index: number) => {
          return <Message msg={msg} key={index} />
        })}
        <div ref={divRef}></div>
        <div>{error}</div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          ref={inputRef}
          className="w-full bg-chatBackground2 rounded border border-chatBorder p-2 text-chatText my-1 focus:ring-0 focus:outline-none"
        ></input>
        <button className="border-chatBorder p-2 text-chatText m-1 hover:bg-chatBorder rounded bg-chatBackground0" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}
