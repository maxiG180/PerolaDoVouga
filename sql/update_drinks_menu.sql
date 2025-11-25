-- Transaction to ensure atomicity
BEGIN;

-- Get Bebidas category ID
DO $$
DECLARE
    cat_bebidas_id uuid;
BEGIN
    SELECT id INTO cat_bebidas_id FROM public.categories WHERE name = 'Bebidas';

    -- If Bebidas category doesn't exist, create it (safety check, though migration_v1 created it)
    IF cat_bebidas_id IS NULL THEN
        INSERT INTO public.categories (name, display_order, icon_name) VALUES ('Bebidas', 12, 'Wine') RETURNING id INTO cat_bebidas_id;
    END IF;

    -- DELETE existing items in Bebidas category
    DELETE FROM public.menu_items WHERE category_id = cat_bebidas_id;

    -- INSERT new items
    -- Aguardentes
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Bagaceira Portuguesa (5cl)', cat_bebidas_id, 1.80, true, 'other'),
    ('Macieira (3cl)', cat_bebidas_id, 2.10, true, 'other'),
    ('Macieira (5cl)', cat_bebidas_id, 2.00, true, 'other'), -- As requested, though price seems inverted
    ('Aliança Velha (5cl)', cat_bebidas_id, 2.20, true, 'other'),
    ('Aguardente Bando (3cl)', cat_bebidas_id, 1.50, true, 'other');

    -- Licores
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Licor Beirão (3cl)', cat_bebidas_id, 1.50, true, 'other'),
    ('Licor Beirão (5cl)', cat_bebidas_id, 2.00, true, 'other'),
    ('Ginja (3cl)', cat_bebidas_id, 1.50, true, 'other'),
    ('Ginja (5cl)', cat_bebidas_id, 1.80, true, 'other'),
    ('Licor Amêndoa Amarga', cat_bebidas_id, 1.50, true, 'other'); -- Assumed price 1.50 as none provided

    -- Vinhos Generosos
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Moscatel Favaios (3cl)', cat_bebidas_id, 1.50, true, 'other'),
    ('Vinho do Porto (3cl)', cat_bebidas_id, 1.20, true, 'other'),
    ('Vinho do Porto (5cl)', cat_bebidas_id, 2.20, true, 'other');

    -- Vermute
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Martini Rosso (5cl)', cat_bebidas_id, 1.80, true, 'other');

    -- Gin
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Gin (5cl)', cat_bebidas_id, 2.30, true, 'other');

    -- Whisky
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('J&B (5cl)', cat_bebidas_id, 2.50, true, 'other');

    -- Vinho Caseiro
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Vinho Tinto (Copo)', cat_bebidas_id, 1.00, true, 'portuguesa'),
    ('Vinho Branco (Copo)', cat_bebidas_id, 1.00, true, 'portuguesa');

    -- Refrigerantes
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Coca-Cola', cat_bebidas_id, 1.60, true, 'other'),
    ('Coca-Cola Zero', cat_bebidas_id, 1.60, true, 'other'),
    ('Sumol Laranja', cat_bebidas_id, 1.60, true, 'other'),
    ('Sumol Ananás', cat_bebidas_id, 1.60, true, 'other'),
    ('Pepsi', cat_bebidas_id, 1.60, true, 'other'),
    ('7UP', cat_bebidas_id, 1.60, true, 'other'),
    ('Ice Tea', cat_bebidas_id, 1.60, true, 'other'),
    ('Vitalis', cat_bebidas_id, 1.60, true, 'other');

    -- Águas
    INSERT INTO public.menu_items (name, category_id, price, is_always_available, cuisine_type) VALUES 
    ('Água (1L)', cat_bebidas_id, 1.50, true, 'other'),
    ('Água (0,5L)', cat_bebidas_id, 1.40, true, 'other'),
    ('Água (0,2L)', cat_bebidas_id, 1.00, true, 'other');

END $$;

COMMIT;
