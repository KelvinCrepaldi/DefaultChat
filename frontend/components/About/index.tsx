"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="section">
      <h1 className="homeTitle">{t("home.aboutTitle")}</h1>
      <p className="homeText">{t("home.aboutP1")}</p>
      <p className="homeText">{t("home.aboutP2")}</p>
      <section className="flex my-20 space-x-4">
        <HighlightTech imageSrc="./nextSVG.svg" text={t("home.techNext")} />
        <HighlightTech
          imageSrc="./ExpressSVG.svg"
          text={t("home.techExpress")}
        />
        <HighlightTech
          imageSrc="./socketSVG.svg"
          text={t("home.techSocket")}
        />
      </section>
    </section>
  );
};

const HighlightTech = ({
  imageSrc,
  text,
}: {
  imageSrc: string;
  text: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-4">
      <Image
        src={imageSrc}
        width={100}
        height={100}
        alt={t("home.techLogoAlt")}
      />
      <p className="text-chatTitle pt-3 text-center">{text}</p>
    </div>
  );
};

export default About;
