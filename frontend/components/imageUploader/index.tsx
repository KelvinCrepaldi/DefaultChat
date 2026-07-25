"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/services";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

const ImageUploader = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setErrorMessage(t("config.imageTooLarge"));
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage(t("config.selectFile"));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await api.post("api/user/img/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      setErrorMessage(t("config.uploadError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.accessToken) setPreviewImage(session.user.picture);
  }, [session]);

  return (
    <div className=" flex flex-col items-center gap-5 max-w-[500px] p-10">
      <h1 className="text-3xl text-chatTitle">
        {t("config.changeProfileImage")}
      </h1>
      <div>
        {previewImage && (
          <img
            src={previewImage}
            className="rounded-full w-[50px] h-[50px] object-cover bg-black"
            width={55}
            height={55}
            alt={t("config.previewAlt")}
          ></img>
        )}
      </div>

      <div className="max-w-[250px] w-full gap-1 flex flex-col">
        <input
          type="file"
          onChange={handleFileChange}
          id="custom-input"
          hidden
        />
        <label htmlFor="custom-input" className="button">
          {t("config.chooseImage")}
        </label>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="button"
        >
          {isLoading ? t("config.uploading") : t("config.upload")}
        </button>
      </div>

      <p className="text-center text-chatTextWhite">{t("config.reloginNote")}</p>
      {errorMessage && (
        <p className="text-center text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default ImageUploader;
