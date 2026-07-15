import { NextResponse } from "next/server";
import { getApiCandidates } from "@/lib/api-config";

export async function GET() {
  for (const baseUrl of getApiCandidates()) {
    try {
      const response = await fetch(`${baseUrl}/api/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const books = await response.json();
        return NextResponse.json(books);
      }
    } catch {
      // Try the next API URL.
    }
  }

  return NextResponse.json(
    { error: "Failed to fetch books from backend" },
    { status: 503 }
  );
}