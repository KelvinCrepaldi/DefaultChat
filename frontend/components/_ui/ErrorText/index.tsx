import { ReactNode } from "react";

const ErrorText = ({ children }: { children: ReactNode }) => (
  <p className="text-orange-500">{children}</p>
);

export default ErrorText;
