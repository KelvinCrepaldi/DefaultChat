import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <section className="h-full min-h-0 overflow-hidden">{children}</section>;
}
