import React from "react";
import Hero from "@/components/_ui/Hero";
import About from "@/components/About";
import Header from "@/components/_ui/Header";
import { Metadata } from "next";
import HomeActions from "@/components/HomeActions";

export const metadata: Metadata = {
  title: "Default Chat",
  description:
    "Projeto de portfólio: chat 1:1 em tempo real com contas, amigos e Socket.io. Demo local com Next.js, Express, TypeORM/PostgreSQL e NextAuth.",
  authors: [
    { name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app" },
  ],
  openGraph: {
    title: "Default Chat",
    description:
      "Projeto de portfólio: chat 1:1 em tempo real com contas, amigos e Socket.io. Demo local com Next.js, Express, TypeORM/PostgreSQL e NextAuth.",
    url: "defaultchat.vercel.app",
    siteName: "DefaultChat",
    images: [
      {
        url: "https://defaultchat.vercel.app/defaultchatLogo.png",
        type: "image/png",
        width: 200,
        height: 200,
        alt: "Default chat logo",
      },
    ],
  },
  other: {
    "google-site-verification": "DmBgV8bvCy3fAvRZz6amgmcgm4D0WYS4s1lquERDyGQ",
  },
};

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HomeActions />
      <About />
    </main>
  );
}
