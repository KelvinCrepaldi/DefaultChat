import { ReactNode } from "react";

type HeaderSectionProps = {
  text: string;
  icon: ReactNode;
};

const HeaderSection = ({ text }: { text: string }) => {
  return (
    <>
      <header className="text-2xl text-chatTitle bg-chatBackground0">
        {text}
      </header>
    </>
  );
};

export default HeaderSection;
