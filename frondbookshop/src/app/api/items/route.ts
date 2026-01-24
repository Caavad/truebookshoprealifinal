import { NextResponse } from "next/server";

export async function GET() {
    const apiHost = process.env.API_HOST || 'http://localhost:5130';

    try {
        const response = await fetch(`${apiHost}/api/books`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
        }

        const books = await response.json();
        return NextResponse.json(books);
    } catch /*(error)*/ {
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
    }
}