"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { formLoginSchema, TFormLoginValues } from "../schema";
import { getApiBaseUrl } from "@/lib/api-config";

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  USE_TRANSLATOR_LOGIN:
    "This account is registered as a translator. Please sign in as translator.",
  USE_USER_LOGIN:
    "This account is registered as a user. Please sign in as user.",
};

const API_URL = getApiBaseUrl();

async function getLoginModeError(
  email: string,
  password: string,
  loginAs: "user" | "translator"
): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const role = data.user.role as string;

    if (role === "Admin") return null;
    if (loginAs === "user" && role === "Author") return "USE_TRANSLATOR_LOGIN";
    if (loginAs === "translator" && role === "Customer") return "USE_USER_LOGIN";

    return null;
  } catch {
    return null;
  }
}

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultLoginAs =
    searchParams.get("mode") === "translator" ? "translator" : "user";

  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      loginAs: defaultLoginAs,
    },
  });

  const loginAs = form.watch("loginAs");

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", {
        email: data.email,
        password: data.password,
        loginAs: data.loginAs,
        redirect: false,
      });

      if (resp?.ok) {
        router.push(data.loginAs === "translator" ? "/author" : "/");
      } else {
        const modeError = await getLoginModeError(
          data.email,
          data.password,
          data.loginAs
        );
        const message =
          LOGIN_ERROR_MESSAGES[modeError ?? ""] || "Invalid credentials";
        form.setError("root", { message });
      }
    } catch (err) {
      console.error(err);

      form.setError("root", { message: "Something went wrong" });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-1/2 flex items-center justify-center p-8">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-[450px] bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Sign in to your BookShop account
                </CardDescription>
                <div className="flex flex-col items-center space-y-4 mt-6">
                  <div className="flex w-full space-x-4">
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                      className="flex items-center justify-center w-1/2 bg-white/20 hover:bg-white/30 text-white font-semibold border-white/30"
                    >
                      <FaGoogle className="mr-2" /> Google
                    </Button>
                    <Button
                      onClick={() => signIn("github", { callbackUrl: "/" })}
                      className="flex items-center justify-center w-1/2 bg-white/20 hover:bg-white/30 text-white font-semibold border-white/30"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </Button>
                  </div>
                  <div className="flex items-center w-full">
                    <hr className="flex-1 border-white/20" />
                    <span className="mx-4 text-xs text-gray-300">
                      OR CONTINUE WITH EMAIL
                    </span>
                    <hr className="flex-1 border-white/20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid w-full items-center gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-white font-medium">Sign in as</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => form.setValue("loginAs", "user")}
                        className={`rounded-md border px-3 py-2 text-sm transition ${
                          loginAs === "user"
                            ? "border-purple-400 bg-purple-500/20 text-white"
                            : "border-white/20 bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        User
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("loginAs", "translator")}
                        className={`rounded-md border px-3 py-2 text-sm transition ${
                          loginAs === "translator"
                            ? "border-purple-400 bg-purple-500/20 text-white"
                            : "border-white/20 bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        Translator (Author)
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      {loginAs === "user"
                        ? "For readers and customers."
                        : "For translators who publish and edit books. Admin can use either option."}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">Email</Label>
                    <Input
                      {...form.register("email")}
                      placeholder="your@email.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                    />
                    {form.formState.errors.email && (
                      <span className="text-red-400 text-sm">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="password" className="text-white font-medium">Password</Label>
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                    />
                    {form.formState.errors.password && (
                      <span className="text-red-400 text-sm">
                        {form.formState.errors.password.message}
                      </span>
                    )}
                  </div>
                  {form.formState.errors.root && (
                    <span className="text-red-400 text-sm text-center">
                      {form.formState.errors.root.message}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col px-6 pb-6">
                <Button
                  className="w-full mb-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <div className="w-full flex justify-between text-sm">
                  <div className="flex space-x-2 text-gray-300">
                    <span>Don&apos;t have an account? </span>
                    <Link className="font-semibold text-white hover:text-purple-300" href="/auth/signup">
                      Sign up
                    </Link>
                  </div>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-semibold text-white hover:text-purple-300"
                  >
                    Reset Password
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </form>
        </FormProvider>
      </div>
      <div className="w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Discover Your Next Read</h2>
            <p className="text-xl text-gray-200 mb-6">
              Join thousands of readers exploring our digital library
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div>Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div>Happy Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}