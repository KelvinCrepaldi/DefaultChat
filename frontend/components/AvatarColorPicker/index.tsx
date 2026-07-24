"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/services";
import { useSession } from "next-auth/react";
import UserAvatar from "../_ui/UserAvatar";
import { AVATAR_COLORS } from "@/utils/avatarColors";

const AvatarColorPicker = () => {
  const { data: session, update } = useSession();
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.picture) {
      setSelectedColor(session.user.picture);
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!session?.user.accessToken) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await api.patch(
        "api/user/avatar-color",
        { color: selectedColor },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const user = response.data;
      await update({ picture: user.image });
      setSuccessMessage("Cor do perfil atualizada.");
    } catch (error) {
      setErrorMessage("Não foi possível salvar a cor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-[500px] p-10">
      <h1 className="text-3xl text-chatTitle">Cor do perfil</h1>

      <UserAvatar
        name={session?.user?.name || "?"}
        image={selectedColor}
        size={72}
      />

      <div className="flex flex-wrap justify-center gap-3">
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full border-2 transition-transform ${
              selectedColor === color
                ? "border-white scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Escolher cor ${color}`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="button max-w-[250px] w-full"
      >
        {isLoading ? "Salvando..." : "Salvar cor"}
      </button>

      {successMessage && (
        <p className="text-center text-green-400">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-center text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default AvatarColorPicker;
