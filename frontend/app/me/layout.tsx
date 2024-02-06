import ChatList from "@/components/ChatList";
import NavButtons from "@/components/Nav";
import User from "@/components/User";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-[100vh] overflow-hidden ">
      <section className="w-[350px] bg-chatBackground0 pl-5 pr-0 pt-1">
        <User />
        <NavButtons />
        <ChatList />
      </section>
      <div className="w-full bg-chatBackground1">{children}</div>
    </main>
  );
}
