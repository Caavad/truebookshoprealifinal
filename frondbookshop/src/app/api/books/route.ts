import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch books from backend API
        const apiUrl = process.env.API_HOST || 'http://localhost:5130';
        const response = await fetch(`${apiUrl}/api/books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const books = await response.json();
        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch books from backend' },
            { status: 500 }
        );
    }
}