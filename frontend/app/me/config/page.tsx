"use client";

import HeaderSection from "@/components/_ui/HeaderSection";
import AvatarColorPicker from "@/components/AvatarColorPicker";
import { useTranslation } from "react-i18next";

export default function Config() {
  const { t } = useTranslation();

  return (
    <section>
      <HeaderSection text={t("nav.settings")} />
      <AvatarColorPicker />
    </section>
  );
}
