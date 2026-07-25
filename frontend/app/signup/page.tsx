import React from "react";
import Header from "@/components/_ui/Header";
import { Metadata } from "next";
import SignupContent from "@/components/SignupContent";

export const metadata: Metadata = {
  title: "Criar conta - Default Chat",
  description: "Página de criação de conta no aplicativo DefaultChat.",
  authors: [
    { name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app" },
  ],
  openGraph: {
    title: "Criar conta - Default Chat",
    description: "Página de criação de conta no aplicativo DefaultChat.",
    url: "defaultchat.vercel.app/signup",
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

export default function Signup() {
  return (
    <>
      <Header />
      <SignupContent />
    </>
  );
}
