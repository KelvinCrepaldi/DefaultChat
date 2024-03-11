import ChatList from "@/components/ChatList";
import NavButtons from "@/components/Nav";
import User from "@/components/User";
import { SocketProvider } from "@/contexts/socketContext";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "Me - Default Chat",
  description: "Página inicial do usuário ao fazer login, onde você pode visualizar suas conversas e interagir com seus contatos.",
  authors: [{name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app"}],
  openGraph:{
    title: "Me - Default Chat",
    description: "Página inicial do usuário ao fazer login, onde você pode visualizar suas conversas e interagir com seus contatos.",
    url: "https://defaultchat.vercel.app/me",
    siteName: "DefaultChat",
    images:[
      {
        url: "/defaultchatlogo.svg",
        width: 200,
        height: 200
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <main className="flex h-[100vh] overflow-hidden ">
        <section className="max-w-[250px] w-full bg-chatBackground0 pl-1 pr-0 pt-1">
          <User />
          <NavButtons />
          <ChatList />
        </section>
        <div className="grow bg-chatBackground1">{children}</div>
      
      </main>
    </SocketProvider>
  );
}
