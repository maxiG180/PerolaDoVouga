-- Add Saturday opening hours field to restaurant_settings
ALTER TABLE restaurant_settings 
ADD COLUMN IF NOT EXISTS opening_hours_saturday TEXT;

-- Update the existing row with the correct hours
UPDATE restaurant_settings
SET 
    opening_hours = '07:00 - 18:00',              -- Segunda a Sexta
    opening_hours_saturday = '08:00 - 15:00',     -- Sábado
    opening_hours_weekend = 'Encerrado',          -- Domingo
    updated_at = NOW()
WHERE id IS NOT NULL;
