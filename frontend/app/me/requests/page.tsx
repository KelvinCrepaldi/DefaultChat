import AddFriend from "@/components/FriendsSearch";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function Requests() {
  return (
    <section className="section-page">
      <HeaderSection text="Buscar usuários" />
      <AddFriend />
    </section>
  );
}
