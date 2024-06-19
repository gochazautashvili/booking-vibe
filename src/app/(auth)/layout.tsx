import { ReactNode } from "react";

const ClerkLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      {children}
    </main>
  );
};

export default ClerkLayout;
