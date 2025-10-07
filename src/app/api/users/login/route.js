import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../lib/supabaseServerClient';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: error.message } },
        { status: 401 }
      );
    }

    // Fetch user profile (horse_ms schema is set in client)
    const { data: profile } = await supabase
      .from('user')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
