import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { email, password, displayName } = await request.json();
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Email, password, and name are required' } },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_EXISTS',
            message: 'A user with this email already exists. Please sign in instead.',
          },
        },
        { status: 400 }
      );
    }

    // 1) Create auth user with auto-confirm (bypasses email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: authError.message } },
        { status: 400 }
      );
    }
    const user = authData?.user;
    if (!user?.id) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: 'User creation failed' } },
        { status: 400 }
      );
    }

    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('Using service role:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('authData.user:', {
      id: authData?.user?.id,
      email: authData?.user?.email,
      identities: authData?.user?.identities?.map((i) => ({
        provider: i.provider,
        id: i.identity_id,
      })),
    });

    // 2) Create profile using service-role (bypasses RLS)
    const { error: profileError } = await supabaseAdmin.from('user').insert({
      id: user.id,
      display_name: displayName,
      email,
      locale: 'en',
      timezone: 'UTC',
    });
    if (profileError) {
      return NextResponse.json(
        {
          error: {
            code: 'PROFILE_CREATE_ERROR',
            message: `Failed to create user profile: ${profileError.message}`,
          },
        },
        { status: 400 }
      );
    }

    // 3) Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      return NextResponse.json(
        { error: { code: 'SIGNIN_ERROR', message: signInError.message } },
        { status: 400 }
      );
    }

    // 4) Read the profile
    const { data: profile } = await supabase.from('user').select('*').eq('id', user.id).single();

    return NextResponse.json({
      user: { id: user.id, email: user.email, ...profile },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
