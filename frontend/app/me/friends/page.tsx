import FriendsList from "@/components/FriendsList";
import RequestsReceived from "@/components/FriendsRequestsReceived";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function Friends() {
  return (
    <section className="h-full overflow-y-auto">
      <HeaderSection text="Amigos" />
      <div className="p-4">
        <RequestsReceived />
        <div className="my-6 border-b border-chatBorder" />
        <FriendsList />
      </div>
    </section>
  );
}
