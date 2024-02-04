import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
