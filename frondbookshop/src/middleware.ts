import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  // /author is the protected editor dashboard. /authors is a public catalogue page.
  const isAuthorPage = pathname === "/author" || pathname.startsWith("/author/");

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

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
