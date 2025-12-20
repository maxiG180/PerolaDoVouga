-- =====================================================
-- PÉROLA DO VOUGA - MANAGEMENT SYSTEM SCHEMA
-- Sistema de Gestão Interno para Despesas, Vendas e Margens
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. EXPENSE CATEGORIES
-- Categorias de despesas (fixas e variáveis)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE, -- Água, Gás, Luz, Salário, SS, Produtos, Outros
    icon text, -- Icon name for UI
    color text, -- Color code for charts/UI
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT expense_categories_pkey PRIMARY KEY (id)
);

-- Insert default categories
INSERT INTO public.expense_categories (name, icon, color) VALUES
    ('Água', '💧', '#3B82F6'),
    ('Gás', '🔥', '#EF4444'),
    ('Luz', '⚡', '#FBBF24'),
    ('Salário Cozinheira', '👩‍🍳', '#8B5CF6'),
    ('Segurança Social', '🏦', '#10B981'),
    ('Renda', '🏠', '#6366F1'),
    ('Produtos Alimentares', '🛒', '#F59E0B'),
    ('Outros', '📋', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 2. EXPENSES
-- Registo de todas as despesas (mensais e diárias)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    category_id uuid NOT NULL REFERENCES public.expense_categories(id) ON DELETE RESTRICT,
    amount decimal(10,2) NOT NULL CHECK (amount >= 0),
    expense_date date NOT NULL,
    description text,
    is_recurring boolean DEFAULT false, -- True para despesas mensais fixas
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by uuid, -- Admin user who created
    CONSTRAINT expenses_pkey PRIMARY KEY (id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON public.expenses(is_recurring);

-- =====================================================
-- 3. SALES LOG
-- Registo diário de vendas por prato
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sales_log (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    item_name text NOT NULL, -- Denormalizar para histórico
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price decimal(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    sale_date date NOT NULL,
    notes text, -- Notas opcionais
    created_at timestamp with time zone NOT  NULL DEFAULT timezone('utc'::text, now()),
    created_by uuid, -- Admin user who registered
    CONSTRAINT sales_log_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sales_log_date ON public.sales_log(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_log_menu_item ON public.sales_log(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_sales_log_created_at ON public.sales_log(created_at DESC);

-- =====================================================
-- 4. RECIPE COSTS
-- Custos e margens por prato do menu
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recipe_costs (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    menu_item_id uuid NOT NULL UNIQUE REFERENCES public.menu_items(id) ON DELETE CASCADE,
    ingredient_cost decimal(10,2) NOT NULL DEFAULT 0 CHECK (ingredient_cost >= 0),
    selling_price decimal(10,2) NOT NULL CHECK (selling_price >= 0),
    -- Margem calculada automaticamente: ((venda - custo) / venda) * 100
    margin_percentage decimal(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN selling_price > 0 THEN 
                ROUND(((selling_price - ingredient_cost) / selling_price) * 100, 2)
            ELSE 0
        END
    ) STORED,
    last_updated timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by uuid,
    CONSTRAINT recipe_costs_pkey PRIMARY KEY (id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_recipe_costs_menu_item ON public.recipe_costs(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_recipe_costs_margin ON public.recipe_costs(margin_percentage);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Apenas utilizadores autenticados podem aceder
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_costs ENABLE ROW LEVEL SECURITY;

-- Policies for expense_categories
CREATE POLICY "Anyone can view expense categories"
    ON public.expense_categories FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can manage categories"
    ON public.expense_categories FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for expenses
CREATE POLICY "Only authenticated users can view expenses"
    ON public.expenses FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update expenses"
    ON public.expenses FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete expenses"
    ON public.expenses FOR DELETE
    USING (auth.role() = 'authenticated');

-- Policies for sales_log
CREATE POLICY "Only authenticated users can view sales"
    ON public.sales_log FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert sales"
    ON public.sales_log FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update sales"
    ON public.sales_log FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete sales"
    ON public.sales_log FOR DELETE
    USING (auth.role() = 'authenticated');

-- Policies for recipe_costs
CREATE POLICY "Only authenticated users can view costs"
    ON public.recipe_costs FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can manage costs"
    ON public.recipe_costs FOR ALL
    USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS
-- Auto-update timestamps
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for expenses
DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for recipe_costs
DROP TRIGGER IF EXISTS update_recipe_costs_updated_at ON public.recipe_costs;
CREATE TRIGGER update_recipe_costs_updated_at
    BEFORE UPDATE ON public.recipe_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA - Recipe Costs
-- Populated for existing menu items with default values
-- =====================================================

-- Insert default recipe costs for all menu items that don't have one
-- Uses the menu_items price as selling_price, ingredient_cost starts at 0
INSERT INTO public.recipe_costs (menu_item_id, ingredient_cost, selling_price)
SELECT 
    mi.id,
    0.00 as ingredient_cost,
    mi.price as selling_price
FROM public.menu_items mi
WHERE NOT EXISTS (
    SELECT 1 FROM public.recipe_costs rc WHERE rc.menu_item_id = mi.id
)
ON CONFLICT (menu_item_id) DO NOTHING;

-- =====================================================
-- USEFUL VIEWS (Optional - for easier queries)
-- =====================================================

-- View: Expenses by Month
CREATE OR REPLACE VIEW expenses_by_month AS
SELECT 
    DATE_TRUNC('month', expense_date) as month,
    ec.name as category,
    SUM(amount) as total_amount,
    COUNT(*) as expense_count
FROM public.expenses e
JOIN public.expense_categories ec ON e.category_id = ec.id
GROUP BY DATE_TRUNC('month', expense_date), ec.name
ORDER BY month DESC, total_amount DESC;

-- View: Sales by Day
CREATE OR REPLACE VIEW sales_by_day AS
SELECT 
    sale_date,
    COUNT(*) as total_sales,
    SUM(quantity) as total_items_sold,
    SUM(total_price) as total_revenue
FROM public.sales_log
GROUP BY sale_date
ORDER BY sale_date DESC;

-- View: Top Selling Items
CREATE OR REPLACE VIEW top_selling_items AS
SELECT 
    sl.item_name,
    sl.menu_item_id,
    SUM(sl.quantity) as total_quantity_sold,
    SUM(sl.total_price) as total_revenue,
    COUNT(*) as number_of_sales
FROM public.sales_log sl
WHERE sl.sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY sl.item_name, sl.menu_item_id
ORDER BY total_quantity_sold DESC
LIMIT 10;

-- View: Items with Low Margins
CREATE OR REPLACE VIEW low_margin_items AS
SELECT 
    mi.name,
    rc.ingredient_cost,
    rc.selling_price,
    rc.margin_percentage,
    CASE 
        WHEN rc.margin_percentage < 30 THEN '🔴 Baixa'
        WHEN rc.margin_percentage < 50 THEN '🟡 Média'
        ELSE '🟢 Boa'
    END as margin_status
FROM public.recipe_costs rc
JOIN public.menu_items mi ON rc.menu_item_id = mi.id
WHERE rc.margin_percentage < 50
ORDER BY rc.margin_percentage ASC;

-- =====================================================
-- AUDIT LOG (Optional - track changes)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.management_audit_log (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    table_name text NOT NULL,
    action text NOT NULL, -- INSERT, UPDATE, DELETE
    record_id uuid NOT NULL,
    old_data jsonb,
    new_data jsonb,
    user_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT management_audit_log_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.management_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.management_audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE public.management_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view audit log"
    ON public.management_audit_log FOR SELECT
    USING (auth.role() = 'authenticated');

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify tables are created
-- 3. Test RLS with authenticated/unauthenticated users
-- 4. Populate with some test data
-- =====================================================
