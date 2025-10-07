import { createSupabaseServerClient } from './supabaseServerClient';

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch additional user profile data from user table (horse_ms schema is set in client)
  const { data: profile } = await supabase.from('user').select('*').eq('id', user.id).single();

  return {
    id: user.id,
    email: user.email,
    ...profile,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (!user.isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}
