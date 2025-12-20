-- Create a table for restaurant settings (singleton pattern)
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
    opening_hours TEXT, -- Can be a JSON or simple text description
    
    -- System
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a single row if it doesn't exist (Singleton)
INSERT INTO restaurant_settings (
    restaurant_name, 
    phone, 
    email, 
    address, 
    google_maps_url,
    facebook_url,
    instagram_url,
    opening_hours
)
SELECT 
    'Pérola do Vouga',
    '+351 234 123 456',
    'geral@peroladovouga.com',
    'Rua Principal, 123, Aveiro, Portugal',
    'https://goo.gl/maps/example',
    'https://facebook.com/peroladovouga',
    'https://instagram.com/peroladovouga',
    'Seg-Sáb: 09:00 - 22:00'
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings);

-- RLS Policies
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public settings read access" 
ON restaurant_settings FOR SELECT 
USING (true);

-- Allow admin update access
CREATE POLICY "Admin settings update access" 
ON restaurant_settings FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow admin insert (only if empty, effectively)
CREATE POLICY "Admin settings insert access" 
ON restaurant_settings FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
