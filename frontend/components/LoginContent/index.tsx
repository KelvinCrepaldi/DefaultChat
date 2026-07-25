"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/_ui/Hero";
import LoginForm from "@/components/_form/loginForm";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function LoginContent() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center px-5 pb-20">
      <Hero variant="auth" />

      <motion.div
        className="mt-6 w-full max-w-[420px] rounded-3xl border border-chatBorder/60 bg-chatBackground2/40 px-6 py-8 backdrop-blur-md sm:px-8"
        custom={0.15}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h1
          className="mb-6 text-center text-2xl font-semibold tracking-tight text-chatTitle"
          custom={0.25}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("auth.loginTitle")}
        </motion.h1>

        <LoginForm />

        <motion.p
          className="mt-5 text-center text-sm text-chatText"
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("auth.loginNoAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-chatTitle transition hover:brightness-110"
          >
            {t("auth.loginCreateAccount")}
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
