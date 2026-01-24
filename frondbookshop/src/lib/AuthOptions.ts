import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_HOST || "http://localhost:7000"
// process.env.API_URL ||
  //"http://localhost:8080"


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
            const res = await fetch(`${API_URL}/auth/login`, {
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
  
            const user = await res.json()
  
            return {
              id: String(user.id),
              email: user.email,
              name: user.fullName
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
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub
        }
        return session
      },
  
      async signIn({ /*user,*/ profile, account }) {
        // OAuth вход (Google / GitHub)
        if (account?.provider !== "credentials") {
          if (!profile?.email) return false
  
          await fetch(`${API_URL}/auth/oauth`, {
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
        }
  
        return true
      }
    }
}
