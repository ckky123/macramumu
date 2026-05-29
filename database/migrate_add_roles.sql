-- ============================================================
-- Migration: Add role system and staff invites
-- Run this in Supabase SQL editor if you already ran schema.sql
-- ============================================================

-- 1. Add role column to existing profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'staff', 'admin'));

-- 2. Sync role with existing is_admin values
UPDATE public.profiles SET role = 'admin' WHERE is_admin = TRUE;

-- 3. Create staff_invites table
CREATE TABLE IF NOT EXISTS public.staff_invites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  accepted    BOOLEAN NOT NULL DEFAULT FALSE,
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable RLS on staff_invites
ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;

-- 5. Only admins can manage invites
CREATE POLICY "invites_admin_all" ON public.staff_invites
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- 6. Update profiles RLS to allow admins to read all profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- Allow admins to update any profile (for role changes)
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- 7. Update the handle_new_user trigger to set role from invite
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.staff_invites
    WHERE email = NEW.email AND accepted = FALSE
  ) INTO invite_exists;

  INSERT INTO public.profiles (id, email, full_name, role, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE WHEN invite_exists THEN 'staff' ELSE 'customer' END,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  IF invite_exists THEN
    UPDATE public.staff_invites SET accepted = TRUE WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Make ckky123@gmail.com admin
UPDATE public.profiles
  SET is_admin = TRUE, role = 'admin'
  WHERE email = 'ckky123@gmail.com';
