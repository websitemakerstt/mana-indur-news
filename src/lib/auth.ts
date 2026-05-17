import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');

export async function login(email: string) {
  const session = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  (await cookies()).set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function logout() {
  (await cookies()).set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getSession() {
  const session = (await cookies()).get('admin_session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
