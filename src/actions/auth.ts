'use server';

import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!email || !username || !password) {
    return { error: 'All fields are required' };
  }

  try {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return { error: 'User with that email or username already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
      },
    });

    // Create session
    await login({ id: user.id, email: user.email, username: user.username });
  } catch (error) {
    console.error('Signup error details:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/');
}

export async function signin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return { error: 'Invalid credentials' };
    }

    await login({ id: user.id, email: user.email, username: user.username });
  } catch (error) {
    console.error('Signin error details:', error);
    return { error: 'Something went wrong.' };
  }

  redirect('/');
}
