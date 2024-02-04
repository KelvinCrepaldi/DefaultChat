import React from "react";
import Chat from "@/components/Chat/Chat";
import Link from "next/link";
import Hero from "@/components/_ui/Hero";
import About from "@/components/About";

import { useSession, signIn } from "next-auth/react";
import {
  LoginButton,
  LogoutButton,
} from "@/components/_ui/buttons/LoginButton";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="flex justify-center my-5 space-x-10 max-w-[700px] m-auto mb-[30vh] px-5">
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
