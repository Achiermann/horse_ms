import { NextResponse } from 'next/server';
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from '../../../../lib/supabaseServerClient';

export async function POST(request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Email, password, and name are required' } },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Password must be at least 6 characters' } },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: authError.message } },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: 'User creation failed' } },
        { status: 500 }
      );
    }

    // Use admin client to create user profile (bypasses RLS)
    const adminClient = createSupabaseAdminClient();
    const { error: profileError } = await adminClient.from('user').insert({
      id: authData.user.id,
      display_name: displayName,
      email: email,
      locale: 'en',
      timezone: 'UTC',
      isAdmin: false,
    });

    if (profileError) {
      // If profile creation fails, we should ideally delete the auth user
      // but for simplicity, we'll just return an error
      return NextResponse.json(
        {
          error: {
            code: 'PROFILE_ERROR',
            message: 'Failed to create user profile: ' + profileError.message,
          },
        },
        { status: 500 }
      );
    }

    // Fetch the complete user profile
    const { data: profile } = await supabase
      .from('user')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...profile,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
