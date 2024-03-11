import React from "react";
import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "Default Chat",
  description: "O Default Chat é um aplicativo de chat que permite a comunicação instantânea entre usuários, possibilitando conversas individuais privadas.",
  authors: [{name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app"}],
  openGraph:{
    title: "Default Chat",
    description: "O Default Chat é um aplicativo de chat que permite a comunicação instantânea entre usuários, possibilitando conversas individuais privadas.",
    url: "defaultchat.vercel.app",
    siteName: "DefaultChat",
    images:[
      {
        url: "https://defaultchat.vercel.app/defaultchatLogo.png",
        type: "image/png",
        width: 200,
        height: 200,
        alt: "Default chat logo"
      }
    ]
  },
  other:{
    'google-site-verification' : "DmBgV8bvCy3fAvRZz6amgmcgm4D0WYS4s1lquERDyGQ"
  }
}

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="flex justify-center my-5 space-x-10 max-w-[700px] m-auto mb-[10vh] px-5">
        <Link className="button" href={"/login"}>
          Fazer login
        </Link>

        <Link className="button" href={"/signup"}>
          Criar uma conta
        </Link>
      </div>
      <About />
    </main>
  );
}
