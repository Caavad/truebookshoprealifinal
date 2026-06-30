//'use client'

import NextTopLoader from 'nextjs-toploader';

import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <NextTopLoader />
    </>
  );
}
