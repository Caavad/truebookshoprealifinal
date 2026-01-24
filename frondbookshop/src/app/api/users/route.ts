export {};
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "../../../../prisma/prisma-client";
// import bcrypt from "bcryptjs";
// import { formRegisterSchema } from "@/app/(withoutnav)/auth/schema";

// export async function GET() {
//   // SELECT * FROM users WHERE email = 'email'

//   const users = await prisma.user.findMany()
//   return NextResponse.json(users)
// }

// // app/api/users/route.ts

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
    
//     // Validate input
//     const result = formRegisterSchema.safeParse(body)
//     if (!result.success) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 })
//     }
    
//     const { fullName, email, password } = result.data

//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     })

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already in use" }, 
//         { status: 400 }
//       )
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await prisma.user.create({
//       data: {
//         fullName,
//         email,
//         password: hashedPassword
//       },
//       select: {
//         id: true,
//         fullName: true,
//         email: true,
//         createdAt: true
//       }
//     })

//     return NextResponse.json(user, { status: 201 })
//   } catch (error) {
//     console.error("Error creating user:", error)
//     return NextResponse.json(
//       { error: "Internal server error" }, 
//       { status: 500 }
//     )
//   }
// }
