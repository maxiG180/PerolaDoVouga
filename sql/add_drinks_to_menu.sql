-- ADD DRINKS CATEGORIES AND ITEMS
-- Run this AFTER populate_menu.sql

-- Add new drink categories
INSERT INTO categories (name, name_en, description, display_order, is_active) VALUES
('Cafetaria', 'Coffee Shop', 'Café e bebidas quentes', 9, true),
('Sanduíches', 'Sandwiches', 'Sanduíches variadas', 10, true),
('Bebidas', 'Drinks', 'Bebidas diversas', 11, true),
('Cervejas', 'Beers', 'Cervejas nacionais e importadas', 12, true),
('Vinhos', 'Wines', 'Vinhos e bebidas alcoólicas', 13, true);

-- CAFETARIA
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Café "Bica" (Balcão)', 'Café expresso ao balcão', 0.75, id, true, 1 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Café "Bica" (Esplanada)', 'Café expresso na esplanada', 0.90, id, true, 2 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Carioca de Café', '', 0.75, id, true, 3 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Copo de Leite', '', 1.00, id, true, 4 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Chávena de Café com Leite', '', 1.50, id, true, 5 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Garoto', 'Café com leite', 0.75, id, true, 6 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Galão', 'Café com muito leite', 1.60, id, true, 7 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Torrada', 'Torrada com manteiga', 1.80, id, true, 8 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Torrada Seca', '', 1.60, id, true, 9 FROM categories WHERE name = 'Cafetaria'
UNION ALL
SELECT 'Pão com Manteiga', '', 1.00, id, true, 10 FROM categories WHERE name = 'Cafetaria';

-- SANDUÍCHES
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Sanduíche de Fiambre', '', 1.90, id, true, 1 FROM categories WHERE name = 'Sanduíches'
UNION ALL
SELECT 'Sanduíche Mista', 'Fiambre e queijo', 2.30, id, true, 2 FROM categories WHERE name = 'Sanduíches'
UNION ALL
SELECT 'Sanduíche de Queijo Flamengo', '', 1.90, id, true, 3 FROM categories WHERE name = 'Sanduíches'
UNION ALL
SELECT 'Cachorro', 'Salsicha em pão', 2.30, id, true, 4 FROM categories WHERE name = 'Sanduíches';

-- BEBIDAS - Refrigerantes e Águas
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Refrigerante', 'Coca-Cola, Fanta, Sprite, Sumol, etc.', 1.60, id, true, 1 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Água Mineral (1L)', '', 1.50, id, true, 2 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Água Mineral (0.5L)', '', 1.40, id, true, 3 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Água Mineral (0.2L)', '', 1.00, id, true, 4 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Sumo Natural', 'Laranja, limão, maçã, pêra', 1.80, id, true, 5 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Batido de Leite', '', 1.80, id, true, 6 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Batido de Frutas', '', 1.80, id, true, 7 FROM categories WHERE name = 'Bebidas'
UNION ALL
SELECT 'Batido de Chocolate', '', 1.80, id, true, 8 FROM categories WHERE name = 'Bebidas';

-- CERVEJAS
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Imperial (0.2L)', 'Cerveja de pressão', 1.30, id, true, 1 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Caneca (0.4L)', 'Cerveja de pressão', 2.00, id, true, 2 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Caneca (0.5L)', 'Cerveja de pressão', 2.00, id, true, 3 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Caneca (1L)', 'Cerveja de pressão', 3.00, id, true, 4 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Cerveja Mini (0.2L)', 'Garrafa pequena', 1.60, id, true, 5 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Cerveja Garrafa (0.33L)', 'Sagres, Super Bock', 1.60, id, true, 6 FROM categories WHERE name = 'Cervejas'
UNION ALL
SELECT 'Cerveja sem Álcool', '', 1.60, id, true, 7 FROM categories WHERE name = 'Cervejas';

-- VINHOS
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Vinho Tinto (Copo)', 'Vinho caseiro', 1.00, id, true, 1 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Vinho Branco (Copo)', 'Vinho caseiro', 1.00, id, true, 2 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Vinho do Porto (3cl)', '', 1.20, id, true, 3 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Vinho do Porto (6cl)', '', 2.20, id, true, 4 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Vinho de Madeira (3cl)', '', 1.20, id, true, 5 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Moscatel de Setúbal (3cl)', '', 1.50, id, true, 6 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Bagaço (3cl)', 'Aguardente nacional', 1.50, id, true, 7 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Aguardente Velha (3cl)', '', 1.50, id, true, 8 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Licor Beirão', 'Licor nacional', 1.50, id, true, 9 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Whisky (3cl)', '', 1.50, id, true, 10 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Gin Tónico', '', 1.80, id, true, 11 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Vodka (6cl)', '', 2.30, id, true, 12 FROM categories WHERE name = 'Vinhos'
UNION ALL
SELECT 'Campari (6cl)', '', 2.30, id, true, 13 FROM categories WHERE name = 'Vinhos';

-- Verify all categories
SELECT c.name as category, COUNT(m.id) as item_count
FROM categories c
LEFT JOIN menu_items m ON c.id = m.category_id
GROUP BY c.name, c.display_order
ORDER BY c.display_order;
