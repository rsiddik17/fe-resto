// src/components/SuspenseWrapper/SuspenseWrapper.tsx
import { Suspense } from "react";
import Loading from "../Loading/Loading";

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper = ({ children }: SuspenseWrapperProps) => {
  return (
    <Suspense fallback={<Loading show={true} message="Memuat halaman..." />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;