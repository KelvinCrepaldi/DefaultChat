"use client";

import { SessionProvider } from "next-auth/react";
import { FriendRequestsProvider } from "@/contexts/friendRequestContext";
import { UserSearchProvider } from "@/contexts/userSearchContext";
import { FriendsProvider } from "@/contexts/friendsContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n, { detectPreferredLanguage } from "@/i18n/config";

function HtmlLangSync({ children }: { children: React.ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    const preferred = detectPreferredLanguage();
    if (i18n.language !== preferred) {
      void i18n.changeLanguage(preferred);
    }
    try {
      window.localStorage.setItem("i18nextLng", preferred);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const lang = i18nInstance.language?.startsWith("pt") ? "pt-BR" : "en";
    document.documentElement.lang = lang;
  }, [i18nInstance.language]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HtmlLangSync>
        <UserSearchProvider>
          <FriendsProvider>
            <FriendRequestsProvider>{children}</FriendRequestsProvider>
          </FriendsProvider>
        </UserSearchProvider>
      </HtmlLangSync>
    </SessionProvider>
  );
}
