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
        <section className="max-w-[250px] w-full bg-chatBackground0 pl-5 pr-0 pt-1">
          <User />
          <NavButtons />
          <ChatList />
        </section>
        <div className="grow bg-chatBackground1">{children}</div>
        <div className="max-w-[250px] lg:w-full bg-chatBackground0 p-1">
          <div className=" w-full  h-full "></div>
        </div>
      </main>
    </SocketProvider>
  );
}
