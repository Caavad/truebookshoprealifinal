import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_HOST ||
  "http://localhost:7000"

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
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

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

          return {
            id: String(data.user.id),
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`.trim(),
            role: data.user.role,
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
