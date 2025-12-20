create table if not exists site_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into site_settings (key, value) values
  ('business_name', 'Pérola do Vouga'),
  ('address', 'Rua Principal, 123, Vouga'),
  ('phone', '+351 123 456 789'),
  ('email', 'peroladovougalda@gmail.com'),
  ('opening_hours_weekdays', 'Segunda a Sábado: 07:00 - 18:30'),
  ('opening_hours_weekend', 'Domingo: Encerrado'),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com')
on conflict (key) do nothing;

-- Enable RLS
alter table site_settings enable row level security;

-- Policies
create policy "Public settings are viewable by everyone"
  on site_settings for select using (true);

create policy "Admins can update settings"
  on site_settings for update using (auth.role() = 'authenticated');

create policy "Admins can insert settings"
  on site_settings for insert with check (auth.role() = 'authenticated');
