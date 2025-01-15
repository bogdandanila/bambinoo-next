import { createClient } from '@/utils/supabase/server';
import {  EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType;

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL(
        '/auth/auth-error?error=no_code&error_description=No authentication code provided',
        request.url
      )
    );
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/auth/auth-error?error=${encodeURIComponent(error.name)}&error_description=${encodeURIComponent(error.message)}`,
          request.url
        )
      );
    }

    // Successful authentication, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    return NextResponse.redirect(
      new URL(
        `/auth/auth-error?error=${encodeURIComponent(errorName)}&error_description=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
} 