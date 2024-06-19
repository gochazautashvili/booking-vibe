import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 xl:px-20 py-4">
      {children}
    </div>
  );
};

export default Container;
