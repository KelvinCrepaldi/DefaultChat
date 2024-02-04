import { ReactNode } from "react";

type HeaderSectionProps = {
  text: string;
  icon: ReactNode;
};

const HeaderSection = ({ text }: { text: string }) => {
  return (
    <>
      <h1 className="text-2xl text-chatTitle bg-chatBackground0">{text}</h1>
    </>
  );
};

export default HeaderSection;
