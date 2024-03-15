'use client'
import ChatList from "@/components/ChatList";
import NavButtons from "@/components/Nav";
import User from "@/components/User";
import IconSquare from "@/components/_ui/IconSquare";
import Loading from "@/components/_ui/Loading";
import { SocketProvider } from "@/contexts/socketContext";
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const {data: session} = useSession({required: true, 
    onUnauthenticated(){
      redirect('/login')
    },
});

  if(!session?.user.accessToken) {
    return <div className="w-full h-[100vh] flex items-center justify-center"><Loading></Loading></div>
  }

  const hiddenMenu = () =>{
    setIsHidden((prev)=> !prev)
  }

  return (
    <SocketProvider>
      <main className="flex h-[100vh] overflow-hidden ">
        <section className={`${isHidden ? "max-w-[70px]" : "max-w-[250px]"}  overflow-hidden transition-all w-full`}>
          <div className={`w-[250px] bg-chatBackground0 pl-1 pr-0 pt-1 overflow-y-auto h-[100vh] `}>
            <div className="m-2">
              <IconSquare>
              <button onClick={hiddenMenu} className=" text-4xl text-chatText hover:text-chatTextWhite">{<IoMenu/>}</button>
              </IconSquare>
            </div>
            
            <User isHidden={isHidden}/>
            <NavButtons isHidden={isHidden}/>
            <ChatList isHidden={isHidden}/>
          </div>
          
        </section>
        <div className={`grow bg-chatBackground1 ${isHidden ? "max-w-[calc(100vw-70px)]" : "max-w-[calc(100vw-250px)]"} transition-all`}>{children}</div>
      
      </main>
    </SocketProvider>
  );
}
