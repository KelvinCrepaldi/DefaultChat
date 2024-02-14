import ChatList from "@/components/ChatList";
import NavButtons from "@/components/Nav";
import User from "@/components/User";
import { SocketProvider } from "@/contexts/socketContext";
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
