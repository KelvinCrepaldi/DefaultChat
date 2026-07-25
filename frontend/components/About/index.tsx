"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const TECHS = [
  { imageSrc: "./nextSVG.svg", key: "home.techNext" },
  { imageSrc: "./ExpressSVG.svg", key: "home.techExpress" },
  { imageSrc: "./socketSVG.svg", key: "home.techSocket" },
] as const;

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="section relative pb-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        <motion.h2 className="homeTitle" variants={item}>
          {t("home.aboutTitle")}
        </motion.h2>
        <motion.p className="homeText max-w-3xl" variants={item}>
          {t("home.aboutP1")}
        </motion.p>
        <motion.p className="homeText max-w-3xl" variants={item}>
          {t("home.aboutP2")}
        </motion.p>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {TECHS.map((tech) => (
            <motion.div
              key={tech.key}
              className="flex flex-col items-center text-center"
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={tech.imageSrc}
                width={88}
                height={88}
                alt={t("home.techLogoAlt")}
              />
              <p className="pt-4 text-sm leading-relaxed text-chatTitle/90 sm:text-base">
                {t(tech.key)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
