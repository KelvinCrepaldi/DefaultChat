import { ReactElement, useState } from "react";

type ColorVariant = "green" | "red" | "yellow" | "blue";

type UserActionBtnProps = {
  icon: JSX.Element;
  handleFunction: (id: string) => void;
  actionId: string;
  color: ColorVariant;
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
}: UserActionBtnProps) {
  const [active, setActive] = useState<boolean>(false);

  const handleClick = () => {
    handleFunction(actionId);
    setActive(true);
  };

  return (
    <button onClick={handleClick} disabled={active} className=" ">
      <span
        className={`${active ? "text-gray-800 " : colorVariants[color]} } `}
      >
        <div className="bg-chatBackground0 rounded-full p-2">{icon}</div>
      </span>
    </button>
  );
}
