import GroupsPanel from "@/components/GroupsPanel";
import HeaderSection from "@/components/_ui/HeaderSection";

export default function GroupsPage() {
  return (
    <section>
      <HeaderSection text="Grupos" />
      <div className="p-4">
        <GroupsPanel />
      </div>
    </section>
  );
}
