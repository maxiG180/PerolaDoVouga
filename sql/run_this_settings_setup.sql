-- 1. Create the table if it doesn't exist (with all columns)
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_name TEXT NOT NULL DEFAULT 'Pérola do Vouga',
    
    -- Contact Info
    phone TEXT,
    email TEXT,
    address TEXT,
    google_maps_url TEXT,
    
    -- Social Media
    facebook_url TEXT,
    instagram_url TEXT,
    
    -- Operational Settings
    is_open BOOLEAN DEFAULT true,
    opening_hours TEXT, 
    opening_hours_weekend TEXT,
    
    -- Social Media Visibility
    show_facebook BOOLEAN DEFAULT true,
    show_instagram BOOLEAN DEFAULT true,
    
    -- System
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. If table exists but missing columns (for existing deployments), add them safely
DO $$
BEGIN
    BEGIN
        ALTER TABLE restaurant_settings ADD COLUMN show_facebook BOOLEAN DEFAULT true;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE restaurant_settings ADD COLUMN show_instagram BOOLEAN DEFAULT true;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE restaurant_settings ADD COLUMN opening_hours_weekend TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END $$;

-- 3. Ensure a row exists (Singleton Pattern)
INSERT INTO restaurant_settings (
    restaurant_name, 
    phone, 
    email, 
    address, 
    google_maps_url,
    facebook_url,
    instagram_url,
    opening_hours,
    opening_hours_weekend,
    show_facebook,
    show_instagram
)
SELECT 
    'Pérola do Vouga',
    '+351 21 846 4584',
    'peroladovougalda@gmail.com',
    'Av. Alm. Reis 243A, 1000-058 Lisboa, Portugal',
    'https://goo.gl/maps/example',
    'https://www.facebook.com/share/1JsK9ftJaX/?mibextid=wwXIfr',
    'https://www.instagram.com/peroladovougaltd',
    '07:00 - 18:30',
    'Encerrado',
    true,
    true
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings);

-- 4. Enable RLS
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Drop first to avoid errors if they exist)
DROP POLICY IF EXISTS "Public settings read access" ON restaurant_settings;
CREATE POLICY "Public settings read access" ON restaurant_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin settings update access" ON restaurant_settings;
CREATE POLICY "Admin settings update access" ON restaurant_settings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin settings insert access" ON restaurant_settings;
CREATE POLICY "Admin settings insert access" ON restaurant_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
