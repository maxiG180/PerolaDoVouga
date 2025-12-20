-- Add visibility flags for social media
ALTER TABLE restaurant_settings 
ADD COLUMN IF NOT EXISTS show_facebook BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_instagram BOOLEAN DEFAULT true;
