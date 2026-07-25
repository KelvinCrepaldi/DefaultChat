"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import HeroBlobs from "./HeroBlobs";

type HeroProps = {
  /** Full landing hero (home). Auth pages use the compact brand header. */
  variant?: "landing" | "auth";
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const Hero = ({ variant = "landing" }: HeroProps) => {
  const { t } = useTranslation();

  if (variant === "auth") {
    return (
      <section className="flex w-full flex-col items-center px-5 pb-2 pt-10">
        <motion.h1
          className="font-display text-5xl font-bold tracking-tight text-chatTitle sm:text-6xl"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("home.brand")}
        </motion.h1>
        <motion.p
          className="homeText mt-3 max-w-xl text-center"
          custom={0.12}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("home.heroSubtitle")}
        </motion.p>
        <motion.div
          className="mx-5 mt-5 h-px w-full max-w-[280px] bg-gradient-to-r from-transparent via-chatTitle to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        />
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[calc(100vh-57px)] w-full flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-10">
      <HeroBlobs />

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <motion.p
          className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-chatTitle/80"
          custom={0.05}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("home.heroEyebrow")}
        </motion.p>

        <motion.h1
          className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-chatTitle sm:text-7xl md:text-8xl"
          custom={0.15}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("home.brand")}
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-lg leading-relaxed text-chatTextWhite/85 sm:text-xl"
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {t("home.heroSubtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Link
            href="/signup"
            className="flex w-full items-center justify-center rounded-xl border border-chatTitle bg-chatTitle px-6 py-3 text-lg font-semibold text-chatBackground0 transition hover:brightness-110 sm:w-auto sm:min-w-[160px]"
          >
            {t("home.signup")}
          </Link>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl border border-chatBorder bg-chatBackground2/80 px-6 py-3 text-lg font-semibold text-chatTitle backdrop-blur-sm transition hover:border-chatTitle/60 hover:bg-chatBackground2 sm:w-auto sm:min-w-[160px]"
          >
            {t("home.login")}
          </Link>
        </motion.div>

        <motion.div
          className="mt-14 h-px w-24 bg-gradient-to-r from-transparent via-chatTitle to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
        />
      </div>
    </section>
  );
};

export default Hero;
