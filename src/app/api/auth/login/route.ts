// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { users } from '@/core/utils/mock-db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find the user in our in-memory database
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches (in a real app, compare hashes)
    if (user && user.password_hash === password) {
      // Don't send the password hash back to the client
      const { password_hash, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword });
    } else {
      // If credentials are wrong, return an error
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
