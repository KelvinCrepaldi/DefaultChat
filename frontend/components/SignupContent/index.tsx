"use client";

import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import SignupForm from "@/components/_form/signupForm";
import { useTranslation } from "react-i18next";

export default function SignupContent() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center">
      <Hero />
      <h1 className="text-chatTitle text-xl">{t("auth.signupTitle")}</h1>
      <SignupForm />
      <p className="text-chatText">
        {t("auth.signupHasAccount")}
        <Link href={"/login"} className="text-chatTitle hover:text-cyan-400">
          {" "}
          {t("auth.signupLogin")}
        </Link>
      </p>
    </main>
  );
}
