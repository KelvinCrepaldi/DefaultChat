import FriendsList from "@/components/FriendsList";
import RequestsReceived from "@/components/FriendsRequestsReceived";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function Friends() {
  return (
    <section>
      <HeaderSection text="Amigos" />
      <div className="p-4">
        <RequestsReceived />
        <FriendsList />
      </div>

    </section>
  );
}
