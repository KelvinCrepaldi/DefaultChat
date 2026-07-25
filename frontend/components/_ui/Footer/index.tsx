"use client";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col items-center text-chatText my-10">
      <p>{t("home.footerAuthor")}</p>
      <p>{t("home.footerSource")}</p>
      <p>{t("home.footerStack")}</p>
    </footer>
  );
};

export default Footer;
