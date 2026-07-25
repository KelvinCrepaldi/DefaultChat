"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const LoginButton = () => {
  const { t } = useTranslation();

  return (
    <button
      onClick={(e) => {
        signIn("", { callbackUrl: "/dashboard" });
        e.preventDefault();
      }}
    >
      {t("auth.signIn")}
    </button>
  );
};

export const RegisterButton = () => {
  const { t } = useTranslation();

  return (
    <Link href="/register" style={{ marginRight: 10 }}>
      {t("auth.register")}
    </Link>
  );
};

export const LogoutButton = () => {
  const { t } = useTranslation();

  return (
    <button style={{ marginRight: 10 }} onClick={() => signOut()}>
      {t("auth.signOut")}
    </button>
  );
};

export const ProfileButton = () => {
  const { t } = useTranslation();

  return <Link href="/profile">{t("auth.profile")}</Link>;
};
