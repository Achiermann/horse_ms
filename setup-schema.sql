-- Run this in Supabase SQL Editor to verify and fix schema configuration

-- 1. Verify the horse_ms schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'horse_ms';

-- 2. Grant proper permissions to all roles
GRANT USAGE ON SCHEMA horse_ms TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA horse_ms TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA horse_ms TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA horse_ms TO postgres, anon, authenticated, service_role;

-- 3. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA horse_ms GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA horse_ms GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA horse_ms GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;

-- 4. Verify the user table exists in horse_ms schema
SELECT table_schema, table_name FROM information_schema.tables
WHERE table_schema = 'horse_ms' AND table_name = 'user';

-- 5. Verify the events table exists in horse_ms schema
SELECT table_schema, table_name FROM information_schema.tables
WHERE table_schema = 'horse_ms' AND table_name = 'events';
