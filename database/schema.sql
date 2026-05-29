-- ============================================================
-- Macramumu Database Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'staff', 'admin')),
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
-- If the email matches a pending staff invite, set role to 'staff'
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
  );

  -- Mark invite as accepted
  IF invite_exists THEN
    UPDATE public.staff_invites SET accepted = TRUE WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Staff Invites ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.staff_invites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  accepted    BOOLEAN NOT NULL DEFAULT FALSE,
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  price             INTEGER NOT NULL CHECK (price >= 0),   -- pence
  compare_at_price  INTEGER CHECK (compare_at_price >= 0), -- pence
  category          TEXT NOT NULL,
  tags              TEXT[] NOT NULL DEFAULT '{}',
  stock             INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_sold_out       BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  discount_percent  INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  weight            INTEGER CHECK (weight >= 0),           -- grams
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-set is_sold_out when stock changes
CREATE OR REPLACE FUNCTION public.update_sold_out()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_sold_out = (NEW.stock = 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_sold_out
  BEFORE INSERT OR UPDATE OF stock ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_sold_out();

-- ─── Product Images ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON public.product_images(product_id);

-- ─── Orders ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orders (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email               TEXT,
  items                     JSONB NOT NULL DEFAULT '[]',
  subtotal                  INTEGER NOT NULL CHECK (subtotal >= 0),
  delivery_fee              INTEGER NOT NULL CHECK (delivery_fee >= 0),
  total                     INTEGER NOT NULL CHECK (total >= 0),
  delivery_option           TEXT NOT NULL DEFAULT 'standard',
  delivery_address          JSONB NOT NULL,
  status                    TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN (
                                'pending', 'payment_processing', 'paid',
                                'preparing', 'dispatched', 'delivered',
                                'cancelled', 'refunded'
                              )),
  stripe_payment_intent_id  TEXT,
  tracking_number           TEXT,
  notes                     TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx  ON public.orders(status);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_invites  ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own; admins can read all
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- Products: anyone can read active products; only admins/staff can write
CREATE POLICY "products_select_active" ON public.products
  FOR SELECT USING (is_active = TRUE OR (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'staff'))
  ));

CREATE POLICY "products_admin_write" ON public.products
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'staff'))
  );

-- Product images: same as products
CREATE POLICY "product_images_select" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "product_images_admin_write" ON public.product_images
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'staff'))
  );

-- Orders: users see their own; admins/staff see all
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'staff'))
  );

CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT WITH CHECK (TRUE); -- allow guest checkout

CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'staff'))
  );

-- Staff invites: only admins can manage
CREATE POLICY "invites_admin_all" ON public.staff_invites
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = TRUE)
  );

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Run this separately in Supabase dashboard > Storage > New bucket
-- Bucket name: product-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- ─── Make yourself admin ─────────────────────────────────────────────────────
-- After signing up, run this to give your account admin access:
-- UPDATE public.profiles SET is_admin = TRUE, role = 'admin' WHERE email = 'ckky123@gmail.com';
