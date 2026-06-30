import NextAuth from "next-auth"
import { authOptions } from "@/lib/AuthOptions"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// import NextAuth from "next-auth"
// import { authOptions } from "@/lib/AuthOptions"

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

// import NextAuth, { DefaultSession, AuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import GitHubProvider from "next-auth/providers/github"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { authOptions } from "@/lib/authOptions"

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string
//     } & DefaultSession["user"]
//   }
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
// /*export*/  /*const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID || "",
//       clientSecret: process.env.GOOGLE_SECRET || ""
//     }),

//     GitHubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || ""
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },

//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null
//         }

//         try {
//           const res = await fetch(`${API_URL}/auth/login`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password
//             })
//           })

//           if (!res.ok) return null

//           const user = await res.json()

//           return {
//             id: String(user.id),
//             email: user.email,
//             name: user.fullName
//           }
//         } catch {
//           return null
//         }
//       }
//     })
//   ],

//   session: {
//     strategy: "jwt"
//   },

//   pages: {
//     signIn: "/auth/signin"
//   },

//   callbacks: {
//     async session({ session, token }) {
//       if (session.user && token.sub) {
//         session.user.id = token.sub
//       }
//       return session
//     },

//     async signIn({ /*user,*//* profile, account }) {
//       // OAuth вход (Google / GitHub)
//       if (account?.provider !== "credentials") {
//         if (!profile?.email) return false

//         await fetch(`${API_URL}/auth/oauth`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             email: profile.email,
//             name: profile.name,
//             provider: account?.provider
//           })
//         })
//       }

//       return true
//     }
//   }
// }*/

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }


// // import NextAuth, { DefaultSession, AuthOptions } from "next-auth"
// // import GoogleProvider from "next-auth/providers/google"
// // import GitHubProvider from "next-auth/providers/github"
// // import CredentialsProvider from "next-auth/providers/credentials"

// // import { prisma } from "@/lib/prisma"

// // declare module "next-auth" {
// //   interface Session extends DefaultSession {
// //     user: {
// //       id: string
// //     } & DefaultSession["user"]
// //   }
// // }

// // export const authOptions: AuthOptions = {
// //   providers: [
// //     GoogleProvider({
// //       clientId: process.env.GOOGLE_ID || "",
// //       clientSecret: process.env.GOOGLE_SECRET || ""
// //     }),
// //     GitHubProvider({
// //       clientId: process.env.GITHUB_ID || "",
// //       clientSecret: process.env.GITHUB_SECRET || ""
// //     }),
// //     CredentialsProvider({
// //       name: "Credentials",
// //       credentials: {
// //         email: { label: "Email", type: "text" },
// //         password: { label: "Password", type: "password" },
// //       },
// //       async authorize(credentials) {
// //         try {
// //           if (!credentials?.email || !credentials?.password) return null

// //           const user = await prisma.user.findUnique({
// //             where: { email: credentials.email }
// //           })

// //           if (!user) return null

         

// //           return {
// //             id: String(user.id),
// //             fullname: user.fullName,
// //             email: user.email
// //           }
// //         } catch {
// //           return null
// //         }
// //       },
// //     }),
// //   ],
// //   pages: {
// //     signIn: "/auth/signin",
// //   },
// //   session: {
// //     strategy: "jwt"
// //   },
// //   callbacks: {
// //     async session({ session, token }) {
// //       if (session.user) {
// //         session.user.id = token.sub as string
// //       }
// //       return session
// //     },
// //     async signIn({ profile }) {
// //       if (!profile?.email) {
// //         return false
// //       }

// //       await prisma.user.upsert({
// //         where: { email: profile.email },
// //         update: {
// //           email: profile.email,
// //           name: profile.name || "Unknown"
// //         },
// //         create: {
// //           email: profile.email,
// //           name: profile.name || "Unknown",
// //           fullName: profile.name || "Unknown",
// //           password: "defaultPassword"
// //         }
// //       });

// //       return true
// //     }
// //   }
// // };

// // const handler = NextAuth(authOptions);
// // export { handler as GET, handler as POST };