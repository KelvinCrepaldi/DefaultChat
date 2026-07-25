"use client";

import AddFriend from "@/components/FriendsSearch";
import HeaderSection from "@/components/_ui/HeaderSection";
import { useTranslation } from "react-i18next";

export default function Requests() {
  const { t } = useTranslation();

  return (
    <section>
      <HeaderSection text={t("nav.searchUsers")} />
      <div className="p-4">
        <AddFriend />
      </div>
    </section>
  );
}
