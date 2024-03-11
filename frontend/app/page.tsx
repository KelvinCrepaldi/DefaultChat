import React from "react";
import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "Default Chat",
  description: "O Default Chat é um aplicativo de chat que permite a comunicação instantânea entre usuários, possibilitando conversas individuais ou em grupo.",
  authors: [{name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app"}],
  openGraph:{
    title: "Default Chat",
    description: "O Default Chat é um aplicativo de chat que permite a comunicação instantânea entre usuários, possibilitando conversas individuais ou em grupo.",
    url: "defaultchat.vercel.app",
    siteName: "DefaultChat",
    images:[
      {
        url: "./defaultchatlogo.svg",
        width: 200,
        height: 200
      }
    ]
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
