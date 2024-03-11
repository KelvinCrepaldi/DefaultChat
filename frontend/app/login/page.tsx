import React from "react";

import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import LoginForm from "@/components/_form/loginForm";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "Fazer login - Default Chat",
  description: "Página para inicar sessão no aplicativo Default chat.",
  authors: [{name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app"}],
  openGraph:{
    title: "Fazer login - Default Chat",
    description: "Página para inicar sessão no aplicativo Default chat.",
    url: "defaultchat.vercel.app/login",
    siteName: "DefaultChat",
    images:[
      {
        url: "/defaultchatLogo.png",
        width: 200,
        height: 200
      }
    ]
  }
}

export default function Login() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <h1 className="text-chatTitle text-xl">Conectar-se</h1>
      <LoginForm />
      <p className="text-chatText">
        Não possui uma conta?
        <Link href={"/signup"} className="text-chatTitle hover:text-cyan-400">
          Criar conta.
        </Link>
      </p>
    </main>
  );
}
