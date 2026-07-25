"use client";

import { SessionProvider } from "next-auth/react";
import { FriendRequestsProvider } from "@/contexts/friendRequestContext";
import { UserSearchProvider } from "@/contexts/userSearchContext";
import { FriendsProvider } from "@/contexts/friendsContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n/config";

function HtmlLangSync({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language?.startsWith("pt") ? "pt-BR" : "en";
    document.documentElement.lang = lang;
  }, [i18n.language]);

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
