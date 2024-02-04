import React from "react";
import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import SignupForm from "@/components/_form/signupForm";

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
