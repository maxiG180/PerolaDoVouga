-- Update Menu V2 (Fixed UUIDs)
-- Cleans up old menu items and repopulates with the new list provided by the client.

-- 0. Ensure icon_name column exists
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_name TEXT;

-- 1. Clear existing items to ensure a clean slate
DELETE FROM menu_items;
DELETE FROM categories;

-- 2. Insert Categories (Letting DB generate UUIDs)
INSERT INTO categories (name, display_order, icon_name) VALUES
('Cafetaria', 1, 'Coffee'),
('Sanduíches', 2, 'Sandwich'),
('Salgados', 3, 'Croissant'),
('Sopas', 4, 'Soup'),
('Peixe', 5, 'Fish'),
('Carne', 6, 'Beef'),
('Arroz', 7, 'Utensils'),
('Omeletes', 8, 'Egg'),
('Saladas', 9, 'Salad'),
('Sobremesas', 10, 'Cake'),
('Bebidas', 11, 'GlassWater'),
('Vinhos', 12, 'Wine'),
('Cervejas', 13, 'Beer');

-- 3. Insert Menu Items using Category Lookups

-- CAFETARIA
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Cafetaria'), true
FROM (VALUES
    ('Café', '', 0.75),
    ('Carioca de Café', '', 0.75),
    ('Copo de Leite', '', 1.00),
    ('Chávena de Café com Leite', '', 1.50),
    ('Garoto', '', 0.75),
    ('Galão', '', 1.60),
    ('Torrada', '', 1.80),
    ('Torrada Seca', '', 1.60),
    ('Pão com Manteiga', '', 1.00)
) AS t(name, description, price);

-- SANDUÍCHES
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Sanduíches'), true
FROM (VALUES
    ('De Fiambre', '', 1.90),
    ('Mista', '', 2.30),
    ('De Queijo Flamengo', '', 1.90),
    ('Cachorro', '', 2.30),
    ('Prego no Pão', '', 5.50),
    ('Bifana de Porco', '', 2.80)
) AS t(name, description, price);

-- SALGADOS
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Salgados'), true
FROM (VALUES
    ('Salgados Variados', 'Preço unitário', 0.90),
    ('Pastelaria Variada', 'Preço unitário', 1.40),
    ('Croquete Pequeno', '', 0.90),
    ('Rissol', '', 1.50),
    ('Merenda', '', 1.20),
    ('Empadas', '', 1.50)
) AS t(name, description, price);

-- SOPAS
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Sopas'), true
FROM (VALUES
    ('Sopa Canja de galinha', '', 1.90),
    ('Sopa de Puré feijão', '', 1.90),
    ('Sopa creme de Abóbora', '', 1.90),
    ('Sopa creme de Cenoura', '', 1.90),
    ('Sopa de agrião', '', 1.90),
    ('Sopa da pedra', '', 1.90),
    ('Juliana', '', 1.90),
    ('Caldo Verde', '', 1.90),
    ('Sopa Primavera', '', 1.90),
    ('Sopa Nabiças', '', 1.90),
    ('Sopa Repoulho', '', 1.90),
    ('Sopa couve', '', 1.90),
    ('Sopa pure grão com espinafres', '', 1.90)
) AS t(name, description, price);

-- PEIXE
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Peixe'), true
FROM (VALUES
    ('Salmão Grelhado', '', 12.50),
    ('Dourada Grelhada', '', 12.00),
    ('Pescada Cozida com Batata Cozida e Legumes', '', 9.80),
    ('Robeirinho grelhado', '', 11.00),
    ('Bacalhau à Minhoca', '', 13.50),
    ('Bacalhau com Natas', '', 9.50),
    ('Bacalhau cozido', '', 15.00),
    ('Bacalhau cozido com grão', '', 15.00),
    ('Peixe espada grelhada', '', 9.00),
    ('Lulas recheadas com puré', '', 10.50),
    ('Choco frito à setubalense', '', 9.50),
    ('Pataniscas de Bacalhau com arroz feijão', '', 9.00),
    ('Salada fria com atum', '', 8.50)
) AS t(name, description, price);

-- CARNE
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Carne'), true
FROM (VALUES
    ('Bifinhos de Frango Grelhados', '', 9.00),
    ('Bifinhos de Peru', '', 9.50),
    ('Iscas à Portuguesa com Batata Cozida', '', 8.50),
    ('Costeleta de Vitela', '', 11.50),
    ('Secretos de Porco Grelhados', '', 9.50),
    ('Alheira Frita com Ovo', '', 9.80),
    ('Bitoque de Novilho', '', 12.00),
    ('Bifinhos de Frango com molho de cogumelos', '', 9.50),
    ('Galinha de cabidela', '', 9.50),
    ('Bifinhos de Porco Grelhados', '', 9.00),
    ('Bifinhos de porco com bacon', '', 9.50),
    ('Grelhada mista', '', 9.80),
    ('Salchichas frescos no couve', '', 9.00),
    ('Carne de porco alentejana', '', 9.50),
    ('Entremeadas grelhadas', '', 8.50),
    ('Carne à Portuguesa', '', 9.00),
    ('Escalopes Vitela', '', 9.80),
    ('Empadão de Vitela', '', 9.80),
    ('Língua de vitela', '', 9.80),
    ('Picanha na grelha', '', 9.50),
    ('Mão de Vaca e grão', '', 9.00),
    ('Almondegas Vitela com puré', '', 9.00),
    ('Bife à Perola', '', 9.80),
    ('Bife ao alinho', '', 9.00),
    ('Bife à Marare', '', 14.00),
    ('Frango de caril', '', 8.00),
    ('Carapaus grelhados', '', 8.70),
    ('Coelho à Serrana', '', 9.80)
) AS t(name, description, price);

-- ARROZ
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Arroz'), true
FROM (VALUES
    ('Arroz de Pato no forno', '', 9.50)
) AS t(name, description, price);

-- OMELETES
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Omeletes'), true
FROM (VALUES
    ('Omelete de fiambre', '', 6.50),
    ('Omelete de queijo', '', 6.50),
    ('Omelete mista', '', 8.00),
    ('Omelete de presunto', '', 7.00),
    ('Omelete de camarão', '', 9.00)
) AS t(name, description, price);

-- SALADAS
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Saladas'), true
FROM (VALUES
    ('Salada de alface', '', 1.50),
    ('Salada de Tomate', '', 1.80),
    ('Salada mista', '', 2.50),
    ('Salada Olivier', '', 7.00),
    ('Salada Cesar', '', 7.00),
    ('Salada ucraniana', '', 7.00)
) AS t(name, description, price);

-- BEBIDAS (Using 'Bebidas' category for general drinks unless specified otherwise)
-- VINHO CASEIRO -> Vinhos
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Vinhos'), true
FROM (VALUES
    ('Vinho Tinto (Copo)', 'Vinho Caseiro', 1.00),
    ('Vinho Branco (Copo)', 'Vinho Caseiro', 1.00)
) AS t(name, description, price);

-- VINHO DO PORTO -> Vinhos
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Vinhos'), true
FROM (VALUES
    ('Vinho do Porto (3cl)', '', 1.20),
    ('Vinho do Porto (5cl)', '', 2.20),
    ('Vinho do Porto Reserva (3cl)', '', 1.20),
    ('Vinho do Porto Reserva (5cl)', '', 2.20),
    ('Vinho do Porto Vintage (3cl)', '', 1.20),
    ('Vinho do Porto Vintage (5cl)', '', 2.20),
    ('Vinho do Porto Velho (3cl)', '', 1.20),
    ('Vinho do Porto Velho (5cl)', '', 2.20),
    ('Vinho de Madeira (3cl)', '', 1.20),
    ('Vinho de Madeira (5cl)', '', 2.20)
) AS t(name, description, price);

-- OUTROS VINHOS GENEROSOS -> Vinhos
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Vinhos'), true
FROM (VALUES
    ('Moscatel de Setúbal (3cl)', '', 1.50),
    ('Lagen (3cl)', '', 1.50),
    ('Fernet (3cl)', '', 1.50)
) AS t(name, description, price);

-- AGUARDENTES NACIONAIS -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Bagaço (3cl)', '', 1.50),
    ('Bagaço (5cl)', '', 1.80),
    ('Aguardente velha (3cl)', '', 1.50),
    ('Aguardente velha (5cl)', '', 1.80),
    ('Aguardente velha reserva (3cl)', '', 1.50),
    ('Aguardente velha reserva (5cl)', '', 1.80),
    ('Bagaceiras (2 Quintas) (3cl)', '', 1.80),
    ('Bagaceiras (2 Quintas) (5cl)', '', 1.50),
    ('Bagaceiras especiais (3cl)', '', 1.80),
    ('Bagaceiras especiais (5cl)', '', 1.50),
    ('Brandies diversos (3cl)', '', 2.20),
    ('Brandies diversos (5cl)', '', 1.80),
    ('Macieira (3cl)', '', 2.10),
    ('Macieira (5cl)', '', 2.00),
    ('Constantino (3cl)', '', 1.65),
    ('Constantino (5cl)', '', 1.50)
) AS t(name, description, price);

-- AGUARDENTES ESTRANGEIRAS -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Cognac', '', 0.00),
    ('Cognac V.S.O.P.', '', 0.00),
    ('Cognac Napoleon', '', 0.00)
) AS t(name, description, price);

-- BEBIDAS DIVERSAS -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Ponche (3cl)', '', 1.80),
    ('Ponche (5cl)', '', 1.80),
    ('Menta (3cl)', '', 1.80),
    ('Menta (5cl)', '', 1.80),
    ('Marrasquino (3cl)', '', 1.80),
    ('Marrasquino (5cl)', '', 1.80),
    ('Cuba libre com rum nacional (3cl)', '', 1.80),
    ('Cuba libre com rum nacional (5cl)', '', 1.80),
    ('Cuba libre com rum estrangeiro (3cl)', '', 1.80),
    ('Cuba libre com rum estrangeiro (5cl)', '', 1.80),
    ('Espumante reserva, doce ou médico (3cl)', '', 1.80),
    ('Espumante reserva, doce ou médico (5cl)', '', 1.80),
    ('Espumante reserva bruto (3cl)', '', 1.80),
    ('Espumante reserva bruto (5cl)', '', 1.80),
    ('Espumoso Indígena (3cl)', '', 1.80),
    ('Espumoso Indígena (5cl)', '', 1.80),
    ('Anisados Amanã (3cl)', '', 1.80),
    ('Anisados Amanã (5cl)', '', 1.80),
    ('Ginja Domus (3cl)', '', 1.80),
    ('Ginja Domus (5cl)', '', 1.80),
    ('Beirãomel (3cl)', '', 1.80),
    ('Beirãomel (5cl)', '', 1.80),
    ('Ginja (3cl)', '', 1.50),
    ('Ginja (5cl)', '', 1.80)
) AS t(name, description, price);

-- WHISKIES -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Whisky (5cl)', 'Várias marcas', 2.50)
) AS t(name, description, price);

-- COCKTAILS -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Cocktails nacionais', '', 1.80),
    ('Cocktails estrangeiros', '', 1.80)
) AS t(name, description, price);

-- LICORES -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Licores nacionais (Beirão)', '', 1.50),
    ('Licores estrangeiros', '', 1.50)
) AS t(name, description, price);

-- GIN -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Gin (5cl)', '', 2.30)
) AS t(name, description, price);

-- REFRIGERANTES -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Refrigerantes', 'Cola, ginger ale, água tónica, Sumol, Sorrela, Sprite, Kas, Green Sands, Fanta, Luso, Ice Tea', 1.60),
    ('Red Bull', '', 2.50)
) AS t(name, description, price);

-- ÁGUAS -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Água minero-medicinal (1L)', '', 1.50),
    ('Água minero-medicinal (0,50L)', '', 1.40),
    ('Água minero-medicinal (0,20L)', '', 1.00)
) AS t(name, description, price);

-- CERVEJAS
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Cervejas'), true
FROM (VALUES
    ('Mini (0,20L)', 'Garrafa', 1.60),
    ('Sagres / Super Bock (0,33L)', 'Garrafa', 1.60),
    ('Sagres sem lata (0,33L)', 'Garrafa', 1.60),
    ('Carlsberg / Tuborg (0,33L)', 'Garrafa', 1.60),
    ('Imperial (0,20L)', 'Copo', 1.30),
    ('Caneca (0,40L)', '', 2.00),
    ('Caneca (0,50L)', '', 2.00),
    ('Caneca (1L)', '', 3.00),
    ('Cerveja sem álcool (Garrafa)', '', 1.60),
    ('Cerveja sem álcool (Lata)', '', 1.60)
) AS t(name, description, price);

-- SUMOS DE FRUTA NATURAL -> Bebidas
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Bebidas'), true
FROM (VALUES
    ('Sumo Natural', 'Laranja, limão, maçã, pêra, etc.', 1.80)
) AS t(name, description, price);

-- SOBREMESA
INSERT INTO menu_items (name, description, price, category_id, is_available)
SELECT name, description, price, (SELECT id FROM categories WHERE name = 'Sobremesas'), true
FROM (VALUES
    ('Arroz-doce', '', 1.80),
    ('Leite creme', '', 1.80),
    ('Mousse de chocolate', '', 2.00),
    ('Baba de camelo', '', 1.80),
    ('Tigelada', '', 2.50),
    ('Bolo de cenoura', '', 1.50),
    ('Bolo com creme', '', 2.50),
    ('Bolo de bolacha', '', 2.50),
    ('Bolo de mel', '', 2.50),
    ('Gelatina', '', 1.80),
    ('Bolo de maça e canela', '', 1.50),
    ('Serradura', '', 2.00),
    ('Chessecake', '', 2.50),
    ('Batatinha doce de chocolate', '', 1.20),
    ('Panquecas de requeijão', '', 2.50),
    ('Crepes ucranianos', 'Chocolate, doce de frutos vermelhos ou leite condensado', 3.00),
    ('Salada fruta', '', 1.80),
    ('Pastel Nata', '', 1.20),
    ('Queque', '', 1.20),
    ('Bolo de Papoila', '', 2.50),
    ('Bolo de Napoleão', '', 2.80),
    ('Bolo de chocolate', '', 2.80),
    ('Massa zero', '', 1.50)
) AS t(name, description, price);
