import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { getApiBaseUrl } from "@/lib/api-config";

const API_URL = getApiBaseUrl();

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        loginAs: { label: "Login As", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const loginAs = credentials.loginAs === "translator" ? "translator" : "user"

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const data = await res.json()
          const role = data.user.role as string

          if (role !== "Admin") {
            if (loginAs === "user" && role === "Author") return null
            if (loginAs === "translator" && role === "Customer") return null
          }

          return {
            id: String(data.user.id),
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`.trim(),
            role,
            accessToken: data.token,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      session.accessToken = token.accessToken as string
      return session
    },

    async signIn({ profile, account }) {
      if (account?.provider !== "credentials") {
        if (!profile?.email) return false

        const nameParts = (profile.name || "User").split(" ")
        const firstName = nameParts[0] || "User"
        const lastName = nameParts.slice(1).join(" ") || firstName
        const username = profile.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_")

        await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profile.email,
            username,
            firstName,
            lastName,
            password: `OAuth_${account?.provider}_${Date.now()}`,
          }),
        })
      }

      return true
    },
  },
}
