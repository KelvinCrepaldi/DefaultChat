"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HomeActions() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center my-5 space-x-10 max-w-[700px] m-auto mb-[10vh] px-5">
      <Link className="button" href={"/login"}>
        {t("home.login")}
      </Link>
      <Link className="button" href={"/signup"}>
        {t("home.signup")}
      </Link>
    </div>
  );
}
