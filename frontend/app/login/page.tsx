import React from "react";

import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import LoginForm from "@/components/_form/loginForm";

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
