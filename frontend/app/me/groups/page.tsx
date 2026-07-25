"use client";

import GroupsPanel from "@/components/GroupsPanel";
import HeaderSection from "@/components/_ui/HeaderSection";
import { useTranslation } from "react-i18next";

export default function GroupsPage() {
  const { t } = useTranslation();

  return (
    <section>
      <HeaderSection text={t("nav.groups")} />
      <div className="p-4">
        <GroupsPanel />
      </div>
    </section>
  );
}
