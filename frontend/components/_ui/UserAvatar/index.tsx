"use client";

import { getInitial, resolveAvatarColor } from "@/utils/avatarColors";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  size?: number;
  className?: string;
};

const UserAvatar = ({
  name,
  image,
  size = 40,
  className = "",
}: UserAvatarProps) => {
  const color = resolveAvatarColor(image, name);
  const initial = getInitial(name);
  const fontSize = Math.max(12, Math.floor(size * 0.42));

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: color,
        fontSize,
      }}
      aria-label={name}
      title={name}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
