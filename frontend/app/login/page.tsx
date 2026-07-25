import React from "react";
import Header from "@/components/_ui/Header";
import { Metadata } from "next";
import LoginContent from "@/components/LoginContent";

export const metadata: Metadata = {
  title: "Fazer login - Default Chat",
  description: "Página para inicar sessão no aplicativo Default chat.",
  authors: [
    { name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app" },
  ],
  openGraph: {
    title: "Fazer login - Default Chat",
    description: "Página para inicar sessão no aplicativo Default chat.",
    url: "defaultchat.vercel.app/login",
    siteName: "DefaultChat",
    images: [
      {
        url: "https://defaultchat.vercel.app/defaultchatLogo.png",
        width: 200,
        height: 200,
      },
    ],
  },
};

export default function Login() {
  return (
    <>
      <Header />
      <LoginContent />
    </>
  );
}
