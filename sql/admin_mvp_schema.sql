-- Admin MVP Schema Updates (Simplified)

-- 1. Update menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS is_always_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS daily_type TEXT DEFAULT 'none' CHECK (daily_type IN ('none', 'soup', 'dish')),
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS allergens TEXT[],
ADD COLUMN IF NOT EXISTS cuisine_type TEXT DEFAULT 'Portuguese' CHECK (cuisine_type IN ('Portuguese', 'African', 'Ukrainian', 'Other'));

-- 2. Create daily_menus table (Simplified: One table for the daily plan)
CREATE TABLE IF NOT EXISTS daily_menus (
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

-- Public read
CREATE POLICY "Public can view daily menus"
ON daily_menus FOR SELECT
USING (true);

-- Admin write
CREATE POLICY "Admins can manage daily menus"
ON daily_menus FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- 5. Create storage bucket for menu images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for public read of images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

-- Policy for admin upload
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'menu-images' );
