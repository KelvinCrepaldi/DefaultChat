"use client";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-chatBorder/50 px-6 py-10 text-center text-sm text-chatText">
      <p className="text-chatTextWhite/70">{t("home.footerAuthor")}</p>
      <p className="mt-1">{t("home.footerSource")}</p>
      <p className="mt-2 text-chatTitle/70">{t("home.footerStack")}</p>
    </footer>
  );
};

export default Footer;
