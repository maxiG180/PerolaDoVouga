-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ALTER EXISTING TABLES
-- Add columns to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS is_always_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_type text DEFAULT 'immediate' CHECK (availability_type = ANY (ARRAY['immediate'::text, 'advance_order'::text])),
ADD COLUMN IF NOT EXISTS advance_notice_days integer,
ADD COLUMN IF NOT EXISTS minimum_quantity integer,
ADD COLUMN IF NOT EXISTS minimum_quantity_text text,
ADD COLUMN IF NOT EXISTS cuisine_type text CHECK (cuisine_type = ANY (ARRAY['portuguesa'::text, 'africana'::text, 'ucraniana'::text, 'other'::text]));

-- Add columns to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'pickup' CHECK (payment_method = ANY (ARRAY['online'::text, 'pickup'::text])),
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
ADD COLUMN IF NOT EXISTS stripe_fee numeric DEFAULT 0;

-- 2. CREATE NEW TABLES
-- Daily menu planning
CREATE TABLE IF NOT EXISTS public.daily_menu_planning (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  date date NOT NULL UNIQUE,
  soup_id uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by uuid,
  CONSTRAINT daily_menu_planning_pkey PRIMARY KEY (id),
  CONSTRAINT daily_menu_planning_soup_id_fkey FOREIGN KEY (soup_id) REFERENCES public.menu_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_menu_planning_date ON public.daily_menu_planning(date);

-- Daily menu items
CREATE TABLE IF NOT EXISTS public.daily_menu_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  planning_id uuid NOT NULL,
  menu_item_id uuid NOT NULL,
  quantity_available integer,
  quantity_sold integer DEFAULT 0,
  is_sold_out boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT daily_menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT daily_menu_items_planning_id_fkey FOREIGN KEY (planning_id) REFERENCES public.daily_menu_planning(id) ON DELETE CASCADE,
  CONSTRAINT daily_menu_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE,
  CONSTRAINT unique_planning_item UNIQUE (planning_id, menu_item_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_menu_items_planning_id ON public.daily_menu_items(planning_id);
CREATE INDEX IF NOT EXISTS idx_daily_menu_items_menu_item_id ON public.daily_menu_items(menu_item_id);

-- 3. SEED DATA (Upsert Logic)
DO $$
DECLARE
    cat_peixe uuid;
    cat_carne uuid;
    cat_omeletes uuid;
    cat_sanduiches uuid;
    cat_sobremesas uuid;
    cat_sopas uuid;
    cat_arroz uuid;
    cat_saladas uuid;
    cat_cafetaria uuid;
    cat_salgados uuid;
    cat_pastelaria uuid;
    cat_bebidas uuid;
BEGIN
    -- Create/Get Categories (Insert if not exists, then select)
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Sopas', 1, 'Soup') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_sopas FROM public.categories WHERE name = 'Sopas';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Peixe', 2, 'Fish') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_peixe FROM public.categories WHERE name = 'Peixe';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Carne', 3, 'Beef') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_carne FROM public.categories WHERE name = 'Carne';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Arroz', 4, 'Bowl') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_arroz FROM public.categories WHERE name = 'Arroz';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Omeletes', 5, 'Egg') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_omeletes FROM public.categories WHERE name = 'Omeletes';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Saladas', 6, 'Salad') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_saladas FROM public.categories WHERE name = 'Saladas';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Sanduíches', 7, 'Sandwich') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_sanduiches FROM public.categories WHERE name = 'Sanduíches';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Salgados', 8, 'Croissant') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_salgados FROM public.categories WHERE name = 'Salgados';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Pastelaria', 9, 'Cake') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_pastelaria FROM public.categories WHERE name = 'Pastelaria';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Sobremesas', 10, 'IceCream') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_sobremesas FROM public.categories WHERE name = 'Sobremesas';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Cafetaria', 11, 'Coffee') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_cafetaria FROM public.categories WHERE name = 'Cafetaria';
    
    INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Bebidas', 12, 'Wine') ON CONFLICT DO NOTHING;
    SELECT id INTO cat_bebidas FROM public.categories WHERE name = 'Bebidas';

    -- ALWAYS AVAILABLE ITEMS
    -- Carne
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Secretos de Porco Grelhados', cat_carne, 9.50, true, 'portuguesa'),
    ('Costeleta de Vitela', cat_carne, 11.50, true, 'portuguesa'),
    ('Bitoque de Novilho', cat_carne, 12.00, true, 'portuguesa'),
    ('Alheira Frita com Ovo', cat_carne, 9.80, true, 'portuguesa'),
    ('Iscas à Portuguesa com Batata Cozida', cat_carne, 8.50, true, 'portuguesa'),
    ('Bifinhos de Frango Grelhados', cat_carne, 9.00, true, 'portuguesa'),
    ('Bifinhos de Peru Grelhados', cat_carne, 9.50, true, 'portuguesa'),
    ('Entremeada Grelhada com Batata e Arroz', cat_carne, 8.50, true, 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Peixe
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Salmão Grelhado', cat_peixe, 12.50, true, 'portuguesa'),
    ('Dourada Grelhada', cat_peixe, 12.00, true, 'portuguesa'),
    ('Pescada Cozida com Batata Cozida e Legumes', cat_peixe, 9.80, true, 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Omeletes
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Omelete de Camarão', cat_omeletes, 9.00, true, 'portuguesa'),
    ('Omelete de fiambre', cat_omeletes, 6.50, true, 'portuguesa'),
    ('Omelete de queijo', cat_omeletes, 6.50, true, 'portuguesa'),
    ('Omelete mista', cat_omeletes, 8.00, true, 'portuguesa'),
    ('Omelete de presunto', cat_omeletes, 7.00, true, 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Sanduíches
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Prego no Pão', cat_sanduiches, 5.50, true, 'portuguesa'),
    ('Bifana de Porco', cat_sanduiches, 2.80, true, 'portuguesa'),
    ('Sandes de Fiambre', cat_sanduiches, 1.90, true, 'portuguesa'),
    ('Sandes Mista', cat_sanduiches, 2.30, true, 'portuguesa'),
    ('Sandes de Queijo Flamengo', cat_sanduiches, 1.90, true, 'portuguesa'),
    ('Cachorro', cat_sanduiches, 2.30, true, 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Sobremesas
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Gelatina Caseira', cat_sobremesas, 1.80, true, 'portuguesa'),
    ('Arroz Doce', cat_sobremesas, 1.80, true, 'portuguesa'),
    ('Mousse de Chocolate', cat_sobremesas, 2.00, true, 'portuguesa'),
    ('Leite creme', cat_sobremesas, 1.80, true, 'portuguesa'),
    ('Baba de camelo', cat_sobremesas, 1.80, true, 'portuguesa'),
    ('Tigelada', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Bolo de cenoura', cat_sobremesas, 1.50, true, 'portuguesa'),
    ('Bolo com creme', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Bolo de bolacha', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Bolo de mel', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Bolo de maça e canela', cat_sobremesas, 1.50, true, 'portuguesa'),
    ('Serradura', cat_sobremesas, 2.00, true, 'portuguesa'),
    ('Chessecake', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Batatinha doce de chocolate', cat_sobremesas, 1.20, true, 'portuguesa'),
    ('Panquecas de requeijão', cat_sobremesas, 2.50, true, 'portuguesa'),
    ('Crepes ucranianos', cat_sobremesas, 3.00, true, 'ucraniana'),
    ('Salada fruta', cat_sobremesas, 1.80, true, 'portuguesa'),
    ('Pastel Nata', cat_sobremesas, 1.20, true, 'portuguesa'),
    ('Queque', cat_sobremesas, 1.20, true, 'portuguesa'),
    ('Bolo de Papoila', cat_sobremesas, 2.50, true, 'ucraniana'),
    ('Bolo de Napoleão', cat_sobremesas, 2.80, true, 'ucraniana'),
    ('Bolo de chocolate', cat_sobremesas, 2.80, true, 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- DAILY PLANNING ITEMS (SOUPS)
    INSERT INTO public.menu_items (name, category_id, price, daily_type, cuisine_type) VALUES 
    ('Sopa Canja de galinha', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa de Puré feijão', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa creme de Abóbora', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa creme de Cenoura', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa de agrião', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa da pedra', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Juliana', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Caldo Verde', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa Primavera', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa Nabiças', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa Repoulho', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa couve', cat_sopas, 1.90, 'soup', 'portuguesa'),
    ('Sopa pure grão com espinafres', cat_sopas, 1.90, 'soup', 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- DAILY PLANNING ITEMS (DISHES)
    -- Peixe
    INSERT INTO public.menu_items (name, category_id, price, daily_type, cuisine_type) VALUES 
    ('Robeirinho grelhado', cat_peixe, 11.00, 'dish', 'portuguesa'),
    ('Bacalhau à Minhoca', cat_peixe, 13.50, 'dish', 'portuguesa'),
    ('Bacalhau com Natas', cat_peixe, 9.50, 'dish', 'portuguesa'),
    ('Bacalhau cozido', cat_peixe, 15.00, 'dish', 'portuguesa'),
    ('Bacalhau cozido com grão', cat_peixe, 15.00, 'dish', 'portuguesa'),
    ('Peixe espada grelhada', cat_peixe, 9.00, 'dish', 'portuguesa'),
    ('Lulas recheadas com puré', cat_peixe, 10.50, 'dish', 'portuguesa'),
    ('Choco frito à setubalense', cat_peixe, 9.50, 'dish', 'portuguesa'),
    ('Pataniscas de Bacalhau com arroz feijão', cat_peixe, 9.00, 'dish', 'portuguesa'),
    ('Salada fria com atum', cat_peixe, 8.50, 'dish', 'portuguesa'),
    ('Carapaus grelhados', cat_peixe, 8.70, 'dish', 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Carne
    INSERT INTO public.menu_items (name, category_id, price, daily_type, cuisine_type) VALUES 
    ('Bifinhos de Frango com molho de cogumelos', cat_carne, 9.50, 'dish', 'portuguesa'),
    ('Galinha de cabidela', cat_carne, 9.50, 'dish', 'portuguesa'),
    ('Bifinhos de porco com bacon', cat_carne, 9.50, 'dish', 'portuguesa'),
    ('Grelhada mista', cat_carne, 9.80, 'dish', 'portuguesa'),
    ('Salchichas frescos no couve', cat_carne, 9.00, 'dish', 'portuguesa'),
    ('Carne de porco alentejana', cat_carne, 9.50, 'dish', 'portuguesa'),
    ('Carne à Portuguesa', cat_carne, 9.00, 'dish', 'portuguesa'),
    ('Escalopes Vitela', cat_carne, 9.80, 'dish', 'portuguesa'),
    ('Empadão de Vitela', cat_carne, 9.80, 'dish', 'portuguesa'),
    ('Língua de vitela', cat_carne, 9.80, 'dish', 'portuguesa'),
    ('Picanha na grelha', cat_carne, 9.50, 'dish', 'portuguesa'),
    ('Mão de Vaca e grão', cat_carne, 9.00, 'dish', 'portuguesa'),
    ('Almondegas Vitela com puré', cat_carne, 9.00, 'dish', 'portuguesa'),
    ('Bife à Perola', cat_carne, 9.80, 'dish', 'portuguesa'),
    ('Bife ao alinho', cat_carne, 9.00, 'dish', 'portuguesa'),
    ('Bife à Marare', cat_carne, 14.00, 'dish', 'portuguesa'),
    ('Frango de caril', cat_carne, 8.00, 'dish', 'africana'),
    ('Coelho à Serrana', cat_carne, 9.80, 'dish', 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Arroz
    INSERT INTO public.menu_items (name, category_id, price, daily_type, cuisine_type) VALUES 
    ('Arroz de Pato no forno', cat_arroz, 9.50, 'dish', 'portuguesa')
    ON CONFLICT DO NOTHING;

    -- Saladas
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Salada de alface', cat_saladas, 1.50, true, 'portuguesa'),
    ('Salada de Tomate', cat_saladas, 1.80, true, 'portuguesa'),
    ('Salada mista', cat_saladas, 2.50, true, 'portuguesa'),
    ('Salada Olivier', cat_saladas, 7.00, true, 'ucraniana'),
    ('Salada Cesar', cat_saladas, 7.00, true, 'other'),
    ('Salada ucraniana', cat_saladas, 7.00, true, 'ucraniana')
    ON CONFLICT DO NOTHING;

    -- Cafetaria
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Café', cat_cafetaria, 0.75, true, 'other'),
    ('Carioca de Café', cat_cafetaria, 0.75, true, 'other'),
    ('Copo de Leite', cat_cafetaria, 1.00, true, 'other'),
    ('Chávena de Café com Leite', cat_cafetaria, 1.50, true, 'other'),
    ('Garoto', cat_cafetaria, 0.75, true, 'other'),
    ('Galão', cat_cafetaria, 1.60, true, 'other'),
    ('Torrada', cat_cafetaria, 1.80, true, 'other'),
    ('Torrada Seca', cat_cafetaria, 1.60, true, 'other'),
    ('Pão com Manteiga', cat_cafetaria, 1.00, true, 'other')
    ON CONFLICT DO NOTHING;

    -- Bebidas (Sample)
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Vinho Tinto (Copo)', cat_bebidas, 1.00, true, 'portuguesa'),
    ('Vinho Branco (Copo)', cat_bebidas, 1.00, true, 'portuguesa'),
    ('Refrigerante', cat_bebidas, 1.60, true, 'other'),
    ('Água (0.5L)', cat_bebidas, 1.40, true, 'other'),
    ('Imperial', cat_bebidas, 1.30, true, 'other')
    ON CONFLICT DO NOTHING;

END $$;
