import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { API_URL } from "@/lib/apiUrl"

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || ""
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!res.ok) return null

          const data = await res.json()
          const user = data?.user

          if (!user) return null

          return {
            id: String(user.id),
            email: user.email,
            name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
            role: user.role,
            accessToken: data.token
          }
        } catch {
          return null
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/auth/signin"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = (user as { role?: string }).role
        token.accessToken = (user as { accessToken?: string }).accessToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string | undefined
      }
      session.accessToken = token.accessToken as string | undefined
      return session
    },

    async signIn({ profile, account }) {
      // OAuth вход (Google / GitHub)
      if (account?.provider !== "credentials") {
        if (!profile?.email) return false

        try {
          await fetch(`${API_URL}/api/auth/oauth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              provider: account?.provider
            })
          })
        } catch {
          // backend не обязателен для OAuth-входа
        }
      }

      return true
    }
  }
}
