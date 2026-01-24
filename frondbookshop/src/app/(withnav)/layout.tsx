import type { Metadata } from "next";
//import { Footer } from "@/components/layout/footer/footer";
import NavBar from "@/components/layout/navbar/navbar";

export const metadata: Metadata = {
  title: "My Bookstore",
  description: "Online bookstore built with Next.js",
};

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
     {/*<Footer />*/ }
    </>
  );
}