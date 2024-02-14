import AddFriend from "@/components/FriendsSearch";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function Requests() {
  return (
    <section>
      <HeaderSection text="Buscar usuários" />
      <div className="p-4">
      <AddFriend />
      </div>
      
    </section>
  );
}
