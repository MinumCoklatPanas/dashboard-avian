import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_session';

export async function POST(request) {
  const { password } = await request.json();
  const expectedPassword = process.env.TEMP_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { success: false, message: 'Server is missing TEMP_PASSWORD configuration.' },
      { status: 500 }
    );
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ success: false, message: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
