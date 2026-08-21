import { NextRequest, NextResponse } from "next/server"
import { formRegisterSchema } from "@/app/(withoutnav)/auth/schema"
import { API_URL } from "@/lib/apiUrl"

function buildUsername(fullName: string, email: string) {
  const base = (fullName || email.split("@")[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")

  return base.length >= 3 ? base.slice(0, 50) : `user_${email.split("@")[0]}`.slice(0, 50)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = formRegisterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 })
  }

  const { fullName, email, password } = parsed.data
  const [firstName, ...rest] = fullName.trim().split(/\s+/)

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        username: buildUsername(fullName, email),
        firstName,
        lastName: rest.join(" ") || firstName,
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message ?? data?.title ?? "Registration failed" },
        { status: res.status }
      )
    }

    return NextResponse.json({ user: data?.user ?? null }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Cannot reach the API server" }, { status: 502 })
  }
}
