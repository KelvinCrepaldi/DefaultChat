import { useState } from "react";

type ColorVariant = "green" | "red" | "yellow" | "blue";

type UserActionBtnProps = {
  icon: JSX.Element;
  handleFunction: (id: string) => void | Promise<void>;
  actionId: string;
  color: ColorVariant;
  locked?: boolean;
  title?: string;
};

const colorVariants = {
  green: "text-green-600 hover:text-green-400",
  red: "text-red-600 hover:text-red-400",
  yellow: "text-yellow-600 hover:text-yellow-400",
  blue: "text-blue-600 hover:text-blue-400",
} as const;

export default function UserActionBtn({
  icon,
  handleFunction,
  actionId,
  color,
  locked = false,
  title,
}: UserActionBtnProps) {
  const [coolingDown, setCoolingDown] = useState(false);

  const handleClick = async () => {
    if (locked || coolingDown) return;
    setCoolingDown(true);
    try {
      await handleFunction(actionId);
    } finally {
      setTimeout(() => setCoolingDown(false), 1000);
    }
  };

  const disabled = locked || coolingDown;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className={`${disabled ? "text-gray-600" : colorVariants[color]}`}>
        <div className="bg-chatBackground0 rounded-full p-2">{icon}</div>
      </span>
    </button>
  );
}
