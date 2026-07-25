"use client";

import Image from "next/image";
import { CgArrowBottomRight } from "react-icons/cg";
import { useTranslation } from "react-i18next";

export default function Me() {
  const { t } = useTranslation();

  return (
    <main className="text-chatText m-10 overflow-y-auto h-[90vh] ">
      <Image
        alt={t("common.logoAlt")}
        src={"/defaultchatLogo.svg"}
        width={200}
        height={200}
      />

      <h1 className="my-10 text-2xl text-chatTitle">{t("welcome.title")}</h1>

      <div className="gap-5 flex flex-col max-w-[800px]">
        <p>{t("welcome.p1")}</p>
        <p>{t("welcome.p2")}</p>
      </div>

      <ul className="flex flex-col gap-5 mt-10 mb-24">
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle">
              <CgArrowBottomRight />
            </span>
            {t("welcome.accountsTitle")}
          </strong>
          <p>{t("welcome.accountsDesc")}</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle">
              <CgArrowBottomRight />
            </span>
            {t("welcome.friendsTitle")}
          </strong>
          <p>{t("welcome.friendsDesc")}</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle">
              <CgArrowBottomRight />
            </span>
            {t("welcome.chatTitle")}
          </strong>
          <p>{t("welcome.chatDesc")}</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle">
              <CgArrowBottomRight />
            </span>
            {t("welcome.localTitle")}
          </strong>
          <p>{t("welcome.localDesc")}</p>
        </li>
      </ul>
    </main>
  );
}
