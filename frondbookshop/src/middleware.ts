import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authPages = ["/auth/signin", "/auth/signup"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const isAdminPage = pathname.startsWith("/admin");
  const isAuthorPage = pathname.startsWith("/author");

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (session?.email && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminPage) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    if (session.role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isAuthorPage) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin?mode=translator", req.url));
    }
    if (session.role !== "Author" && session.role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|public|.*\\..*).*)"],
};
