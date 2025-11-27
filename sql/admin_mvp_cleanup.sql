-- Admin MVP Schema Cleanup & Simplification

-- 1. Drop old/redundant tables if they exist
DROP TABLE IF EXISTS daily_menu_dishes CASCADE;
DROP TABLE IF EXISTS daily_menu_items CASCADE;
DROP TABLE IF EXISTS daily_menu_planning CASCADE;
DROP TABLE IF EXISTS daily_menus CASCADE;

-- 2. Create the SINGLE simplified daily_menus table
CREATE TABLE daily_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    soup_id UUID REFERENCES menu_items(id),
    dish_ids UUID[] DEFAULT '{}', -- Array of dish IDs for the day
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE daily_menus ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Public can view daily menus"
ON daily_menus FOR SELECT
USING (true);

CREATE POLICY "Admins can manage daily menus"
ON daily_menus FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- 5. Ensure menu_items has the correct columns (idempotent)
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS is_always_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS daily_type TEXT DEFAULT 'none' CHECK (daily_type IN ('none', 'soup', 'dish')),
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS allergens TEXT[],
ADD COLUMN IF NOT EXISTS cuisine_type TEXT DEFAULT 'Portuguese' CHECK (cuisine_type IN ('Portuguese', 'African', 'Ukrainian', 'Other'));

-- 6. Ensure storage bucket exists (if not already)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Drop first to avoid conflicts if re-running)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'menu-images' );
