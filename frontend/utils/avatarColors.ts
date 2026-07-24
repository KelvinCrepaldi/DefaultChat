export const AVATAR_COLORS = [
  "#33BBB0",
  "#E57373",
  "#64B5F6",
  "#81C784",
  "#FFB74D",
  "#BA68C8",
  "#4DB6AC",
  "#F06292",
] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number];

export const isAvatarColor = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return (
    (AVATAR_COLORS as readonly string[]).includes(value) ||
    /^#[0-9A-Fa-f]{6}$/.test(value)
  );
};

export const colorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const resolveAvatarColor = (
  imageOrColor: string | null | undefined,
  name: string
): string => {
  if (isAvatarColor(imageOrColor)) {
    return imageOrColor as string;
  }
  return colorFromName(name || "?");
};

export const getInitial = (name: string): string => {
  const trimmed = (name || "?").trim();
  return trimmed.charAt(0).toUpperCase() || "?";
};
