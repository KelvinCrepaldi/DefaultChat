import FriendsList from "@/components/FriendsList";
import RequestsReceived from "@/components/FriendsRequestsReceived";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function Friends() {
  return (
    <section className="section-page">
      <HeaderSection text="Amigos" />
      <RequestsReceived />
      <FriendsList />
    </section>
  );
}
