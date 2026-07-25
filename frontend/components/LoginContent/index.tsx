"use client";

import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import LoginForm from "@/components/_form/loginForm";
import { useTranslation } from "react-i18next";

export default function LoginContent() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center">
      <Hero />
      <h1 className="text-chatTitle text-xl">{t("auth.loginTitle")}</h1>
      <LoginForm />
      <p className="text-chatText">
        {t("auth.loginNoAccount")}
        <Link href={"/signup"} className="text-chatTitle hover:text-cyan-400">
          {t("auth.loginCreateAccount")}
        </Link>
      </p>
    </main>
  );
}
