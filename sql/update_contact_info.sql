-- Quick UPDATE script to fix contact information in existing restaurant_settings row
-- Run this in Supabase SQL Editor

UPDATE restaurant_settings
SET 
    phone = '+351 21 846 4584',
    email = 'peroladovougalda@gmail.com',
    address = 'Av. Alm. Reis 243 A, 1000-051 Lisboa',
    updated_at = NOW()
WHERE id IS NOT NULL;
