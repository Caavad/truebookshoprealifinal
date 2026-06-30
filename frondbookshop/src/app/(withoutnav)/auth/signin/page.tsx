import { Metadata } from "next";
import SignIn from "./signin";

export const metadata: Metadata = {
  title: "Sign In | Your App Name",
  description:
    "Sign in to your account to access exclusive features and manage your profile.",
  openGraph: {
    title: "Sign In | Your App Name",
    description: "Access your account and enjoy exclusive features.",
    images: [
      {
        url: "/images/signin-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sign In to Your App Name",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Your App Name",
    description: "Sign in to your account for a personalized experience.",
    images: ["/images/signin-twitter-image.jpg"],
  },
};

export default function SignInPage() {
  return <SignIn />;
}
