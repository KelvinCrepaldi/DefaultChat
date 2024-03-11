import React from "react";
import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import SignupForm from "@/components/_form/signupForm";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: "Criar conta - Default Chat",
  description: "Página de criação de conta no aplicativo DefaultChat.",
  authors: [{name: "Kelvin Crepaldi", url: "https://kelvincrepaldi.vercel.app"}],
  openGraph:{
    title: "Criar conta - Default Chat",
    description: "Página de criação de conta no aplicativo DefaultChat.",
    url: "defaultchat.vercel.app/signup",
    siteName: "DefaultChat",
    images:[
      {
        url: "https://defaultchat.vercel.app/defaultchatLogo.png",
        width: 200,
        height: 200
      }
    ]
  }
}

export default function Signup() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <h1 className="text-chatTitle text-xl">Criar conta</h1>
      <SignupForm />
      <p className="text-chatText">
        Já possui uma conta?
        <Link href={"/login"} className="text-chatTitle hover:text-cyan-400">
          {" "}
          Fazer login.
        </Link>
      </p>
    </main>
  );
}
