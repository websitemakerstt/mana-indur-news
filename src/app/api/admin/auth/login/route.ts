import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH;

    if (email === adminEmail && password === adminPassword) {
      await login(email);
      return NextResponse.json({ message: 'Logged in successfully' });
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
