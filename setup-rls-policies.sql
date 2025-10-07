-- RLS Policies for horse_ms schema

-- ============================================
-- USER TABLE RLS POLICIES
-- ============================================

-- Enable RLS on user table (if not already enabled)
ALTER TABLE horse_ms.user ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "users_insert_own" ON horse_ms.user;
DROP POLICY IF EXISTS "users_select_own" ON horse_ms.user;
DROP POLICY IF EXISTS "users_update_own" ON horse_ms.user;
DROP POLICY IF EXISTS "users_delete_own" ON horse_ms.user;

-- Allow users to insert their own profile during signup
-- This allows the service_role to insert during signup
CREATE POLICY "users_insert_own" ON horse_ms.user
  FOR INSERT
  WITH CHECK (true);  -- Allow service_role to insert during signup

-- Allow users to view their own profile
CREATE POLICY "users_select_own" ON horse_ms.user
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own" ON horse_ms.user
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "users_delete_own" ON horse_ms.user
  FOR DELETE
  USING (auth.uid() = id);


-- ============================================
-- EVENTS TABLE RLS POLICIES
-- ============================================

-- Enable RLS on events table (if not already enabled)
ALTER TABLE horse_ms.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "events_select_own" ON horse_ms.events;
DROP POLICY IF EXISTS "events_insert_own" ON horse_ms.events;
DROP POLICY IF EXISTS "events_update_own" ON horse_ms.events;
DROP POLICY IF EXISTS "events_delete_own" ON horse_ms.events;

-- Allow users to view their own events
CREATE POLICY "events_select_own" ON horse_ms.events
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Allow users to create events (they become the owner)
CREATE POLICY "events_insert_own" ON horse_ms.events
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own events
CREATE POLICY "events_update_own" ON horse_ms.events
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to delete their own events
CREATE POLICY "events_delete_own" ON horse_ms.events
  FOR DELETE
  USING (auth.uid() = owner_id);
