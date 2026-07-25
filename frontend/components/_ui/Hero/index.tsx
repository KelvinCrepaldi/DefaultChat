"use client";

import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col items-center p-5 pt-10">
      <h1 className="text-chatTitle text-7xl">{t("home.brand")}</h1>
      <p className="homeText">{t("home.heroSubtitle")}</p>
      <div className="w-full max-w-[600px] mx-5 h-[2px] bg-chatTitle mt-5"></div>
    </section>
  );
};

export default Hero;
