"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const GITHUB_REPO = "https://github.com/KelvinCrepaldi/DefaultChat";

const LANGUAGES = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
] as const;

export default function Header(): JSX.Element {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("pt") ? "pt" : "en";
  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[1];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="px-4 py-2 w-full flex items-center justify-between bg-chatBackground0 border-b border-chatBorder">
      <Link href={"/"} className="shrink-0">
        <Image
          src="/defaultchatlogo.svg"
          alt={t("common.logoAlt")}
          width={40}
          height={40}
          priority
        />
      </Link>

      <div className="flex items-center gap-3">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("header.githubAria")}
          className="bg-chatBackground1 rounded-full p-2 text-chatText hover:text-chatTextWhite hover:bg-chatBackground2 border border-chatBorder transition-colors"
        >
          <FaGithub className="text-xl" />
        </a>

        <label className="sr-only" htmlFor="language-select">
          {t("header.languageAria")}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-2 pointer-events-none text-base leading-none">
            {current.flag}
          </span>
          <select
            id="language-select"
            value={currentLang}
            onChange={handleLanguageChange}
            aria-label={t("header.languageAria")}
            className="appearance-none bg-chatBackground1 border border-chatBorder rounded pl-8 pr-7 py-1.5 text-sm text-chatText hover:text-chatTextWhite focus:outline-none focus:border-chatTitle cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
