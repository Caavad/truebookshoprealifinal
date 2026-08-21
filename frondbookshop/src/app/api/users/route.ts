import { NextRequest, NextResponse } from "next/server"
import { formRegisterSchema } from "@/app/(withoutnav)/auth/schema"
import { getApiBaseUrl } from "@/lib/api-config"

const API_URL = getApiBaseUrl()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = formRegisterSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { fullName, email, password, role } = result.data
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0] || fullName
    const lastName = nameParts.slice(1).join(" ") || firstName
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_")

    const register = (username: string) =>
      fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          firstName,
          lastName,
          password,
          role: role || "Customer",
        }),
      })

    let response = await register(baseUsername)
    let data = await response.json()

    // The username is derived from the email, so different emails can collide.
    if (!response.ok && typeof data?.message === "string" && data.message.includes("username")) {
      response = await register(`${baseUsername}_${Date.now().toString().slice(-5)}`)
      data = await response.json()
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: response.status }
      )
    }

    return NextResponse.json(data.user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
