-- PÉROLA DO VOUGA - MENU DATABASE POPULATION
-- Execute this in your Supabase SQL Editor

-- First, insert categories
INSERT INTO categories (name, name_en, description, display_order, is_active) VALUES
('Sopas', 'Soups', 'Sopas caseiras diárias', 1, true),
('Peixe', 'Fish', 'Pratos de peixe fresco', 2, true),
('Carne', 'Meat', 'Pratos de carne', 3, true),
('Arroz', 'Rice', 'Pratos de arroz', 4, true),
('Omeletes', 'Omelettes', 'Omeletes variadas', 5, true),
('Saladas', 'Salads', 'Saladas frescas', 6, true),
('Salgados', 'Savory Snacks', 'Salgados variados', 7, true),
('Sobremesas', 'Desserts', 'Sobremesas caseiras', 8, true);

-- Get category IDs (you'll need to run this query first to get the UUIDs)
-- Then replace the category_id values below with the actual UUIDs from your database

-- For now, I'll create a version that works with category names
-- You can run this after getting the category IDs:

-- SOPAS (€1.90 each)
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order) 
SELECT 'Sopa Canja de Galinha', 'Sopa tradicional portuguesa', 1.90, id, true, 1 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa de Puré de Feijão', '', 1.90, id, true, 2 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa Creme de Abóbora', '', 1.90, id, true, 3 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa Creme de Cenoura', '', 1.90, id, true, 4 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa de Agrião', '', 1.90, id, true, 5 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa da Pedra', '', 1.90, id, true, 6 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa Juliana', '', 1.90, id, true, 7 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Caldo Verde', 'Sopa tradicional portuguesa', 1.90, id, true, 8 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa Primavera', '', 1.90, id, true, 9 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa de Nabiças', '', 1.90, id, true, 10 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa de Repolho', '', 1.90, id, true, 11 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa de Couve', '', 1.90, id, true, 12 FROM categories WHERE name = 'Sopas'
UNION ALL
SELECT 'Sopa Puré de Grão com Espinafres', '', 1.90, id, true, 13 FROM categories WHERE name = 'Sopas';

-- PEIXE
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Salmão Grelhado', 'Salmão fresco grelhado', 12.50, id, true, 1 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Dourada Grelhada', 'Dourada fresca grelhada', 12.00, id, true, 2 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Pescada Cozida', 'Com batata cozida e legumes', 9.80, id, true, 3 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Robeirinho Grelhado', '', 11.00, id, true, 4 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Bacalhau à Minhoca', '', 13.50, id, true, 5 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Bacalhau com Natas', 'Bacalhau gratinado com natas', 9.50, id, true, 6 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Bacalhau Cozido', 'Bacalhau cozido tradicional', 15.00, id, true, 7 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Bacalhau Cozido com Grão', '', 15.00, id, true, 8 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Peixe Espada Grelhado', '', 9.00, id, true, 9 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Lulas Recheadas', 'Com puré de batata', 10.50, id, true, 10 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Choco Frito à Setubalense', '', 9.50, id, true, 11 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Pataniscas de Bacalhau', 'Com arroz de feijão', 9.00, id, true, 12 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Salada Fria com Atum', '', 8.50, id, true, 13 FROM categories WHERE name = 'Peixe'
UNION ALL
SELECT 'Carapaus Grelhados', '', 8.70, id, true, 14 FROM categories WHERE name = 'Peixe';

-- CARNE
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Bifinhos de Frango Grelhados', '', 9.00, id, true, 1 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bifinhos de Peru', '', 9.50, id, true, 2 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Iscas à Portuguesa', 'Com batata cozida', 8.50, id, true, 3 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Costeleta de Vitela', '', 11.50, id, true, 4 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Secretos de Porco Grelhados', '', 9.50, id, true, 5 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Alheira Frita com Ovo', '', 9.80, id, true, 6 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bitoque de Novilho', '', 12.00, id, true, 7 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Prego no Pão', '', 5.50, id, true, 8 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bifana de Porco', '', 2.80, id, true, 9 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bifinhos de Frango com Cogumelos', 'Com molho de cogumelos', 9.50, id, true, 10 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Galinha de Cabidela', '', 9.50, id, true, 11 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bifinhos de Porco Grelhados', '', 9.00, id, true, 12 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bifinhos de Porco com Bacon', '', 9.50, id, true, 13 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Grelhada Mista', '', 9.80, id, true, 14 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Salsichas Frescas no Couve', '', 9.00, id, true, 15 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Carne de Porco à Alentejana', '', 9.50, id, true, 16 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Entremeadas Grelhadas', '', 8.50, id, true, 17 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Carne à Portuguesa', '', 9.00, id, true, 18 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Escalopes de Vitela', '', 9.80, id, true, 19 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Empadão de Vitela', '', 9.80, id, true, 20 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Língua de Vitela', '', 9.80, id, true, 21 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Picanha na Grelha', '', 9.50, id, true, 22 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Mão de Vaca com Grão', '', 9.00, id, true, 23 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Almôndegas de Vitela', 'Com puré de batata', 9.00, id, true, 24 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bife à Pérola', 'Especialidade da casa', 9.80, id, true, 25 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bife ao Alinho', '', 9.00, id, true, 26 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Bife à Marrare', '', 14.00, id, true, 27 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Frango de Caril', '', 8.00, id, true, 28 FROM categories WHERE name = 'Carne'
UNION ALL
SELECT 'Coelho à Serrana', '', 9.80, id, true, 29 FROM categories WHERE name = 'Carne';

-- ARROZ
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Arroz de Pato no Forno', 'Arroz de pato tradicional', 9.50, id, true, 1 FROM categories WHERE name = 'Arroz';

-- OMELETES
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Omelete de Fiambre', '', 6.50, id, true, 1 FROM categories WHERE name = 'Omeletes'
UNION ALL
SELECT 'Omelete de Queijo', '', 6.50, id, true, 2 FROM categories WHERE name = 'Omeletes'
UNION ALL
SELECT 'Omelete Mista', '', 8.00, id, true, 3 FROM categories WHERE name = 'Omeletes'
UNION ALL
SELECT 'Omelete de Presunto', '', 7.00, id, true, 4 FROM categories WHERE name = 'Omeletes'
UNION ALL
SELECT 'Omelete de Camarão', '', 9.00, id, true, 5 FROM categories WHERE name = 'Omeletes';

-- SALADAS
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Salada de Alface', '', 1.50, id, true, 1 FROM categories WHERE name = 'Saladas'
UNION ALL
SELECT 'Salada de Tomate', '', 1.80, id, true, 2 FROM categories WHERE name = 'Saladas'
UNION ALL
SELECT 'Salada Mista', '', 2.50, id, true, 3 FROM categories WHERE name = 'Saladas'
UNION ALL
SELECT 'Salada Olivier', '', 3.00, id, true, 4 FROM categories WHERE name = 'Saladas'
UNION ALL
SELECT 'Salada César', '', 3.00, id, true, 5 FROM categories WHERE name = 'Saladas'
UNION ALL
SELECT 'Salada Ucraniana', '', 3.00, id, true, 6 FROM categories WHERE name = 'Saladas';

-- SALGADOS (price range €0.90 - €1.60, using average €1.25)
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Croquete Pequeno', '', 0.90, id, true, 1 FROM categories WHERE name = 'Salgados'
UNION ALL
SELECT 'Rissol', '', 1.50, id, true, 2 FROM categories WHERE name = 'Salgados'
UNION ALL
SELECT 'Empadas', '', 1.50, id, true, 3 FROM categories WHERE name = 'Salgados';

-- SOBREMESAS
INSERT INTO menu_items (name, description, price, category_id, is_available, display_order)
SELECT 'Arroz-Doce', 'Sobremesa tradicional portuguesa', 1.80, id, true, 1 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Leite Creme', '', 1.80, id, true, 2 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Mousse de Chocolate', '', 2.00, id, true, 3 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Baba de Camelo', '', 1.80, id, true, 4 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Tigelada', '', 2.50, id, true, 5 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo de Cenoura', '', 1.50, id, true, 6 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo com Creme', '', 2.50, id, true, 7 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo de Bolacha', '', 2.50, id, true, 8 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo de Mel', '', 2.50, id, true, 9 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Gelatina', '', 1.80, id, true, 10 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo de Maçã e Canela', '', 1.50, id, true, 11 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Serradura', '', 2.00, id, true, 12 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Cheesecake', '', 2.50, id, true, 13 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Batatinha Doce de Chocolate', '', 1.20, id, true, 14 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Panquecas de Requeijão', '', 2.50, id, true, 15 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Crepes Ucranianos', 'Com chocolate/doce de frutos vermelhos/leite condensado', 3.00, id, true, 16 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Salada de Fruta', '', 1.80, id, true, 17 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Pastel de Nata', 'Pastel de nata tradicional', 1.20, id, true, 18 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Queque', '', 1.20, id, true, 19 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Bolo de Papoula', '', 2.50, id, true, 20 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Massa Zero', '', 1.50, id, true, 21 FROM categories WHERE name = 'Sobremesas'
UNION ALL
SELECT 'Merenda', '', 1.20, id, true, 22 FROM categories WHERE name = 'Sobremesas';

-- Verify the data
SELECT c.name as category, COUNT(m.id) as item_count
FROM categories c
LEFT JOIN menu_items m ON c.id = m.category_id
GROUP BY c.name
ORDER BY c.display_order;
