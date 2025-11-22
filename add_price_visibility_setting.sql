-- Add setting to control price visibility on website
INSERT INTO site_settings (key, value) VALUES
  ('show_prices_on_website', 'false')  -- Set to 'true' when ready to show prices
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Note: Prices are still stored in database and used for orders
-- This setting only controls frontend display
