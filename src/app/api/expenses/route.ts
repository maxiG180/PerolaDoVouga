import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get query params
        const { searchParams } = new URL(request.url)
        const month = searchParams.get('month') // Format: YYYY-MM
        const categoryId = searchParams.get('category_id')

        let query = supabase
            .from('expenses')
            .select(`
                *,
                expense_categories (
                    name,
                    icon,
                    color
                )
            `)
            .order('expense_date', { ascending: false })

        // Apply filters
        if (month) {
            const [year, monthNum] = month.split('-')
            const startDate = `${year}-${monthNum}-01`
            const endDate = new Date(Number(year), Number(monthNum), 0).toISOString().split('T')[0]
            query = query.gte('expense_date', startDate).lte('expense_date', endDate)
        }

        if (categoryId) {
            query = query.eq('category_id', categoryId)
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { category_id, amount, expense_date, description, is_recurring } = body

        // Validate
        if (!category_id || !amount || !expense_date) {
            return NextResponse.json(
                { error: 'Missing required fields: category_id, amount, expense_date' },
                { status: 400 }
            )
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
        }

        // First, get the actual category UUID from the database
        // The frontend sends a category "name" identifier (agua, gas, etc.)
        // We need to look up the actual UUID
        const { data: categoryData, error: catError } = await supabase
            .from('expense_categories')
            .select('id')
            .eq('name', getCategoryNameFromId(category_id))
            .single()

        if (catError || !categoryData) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
        }

        // Insert expense
        const { data, error } = await supabase
            .from('expenses')
            .insert([{
                category_id: categoryData.id,
                amount: Number(amount),
                expense_date,
                description: description || null,
                is_recurring: is_recurring || false,
                created_by: user.id
            }])
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating expense:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Helper to map frontend category IDs to database category names
function getCategoryNameFromId(id: string): string {
    const mapping: Record<string, string> = {
        'agua': 'Água',
        'gas': 'Gás',
        'luz': 'Luz',
        'salario': 'Salário Cozinheira',
        'ss': 'Segurança Social',
        'renda': 'Renda',
        'produtos': 'Produtos Alimentares',
        'outros': 'Outros'
    }
    return mapping[id] || 'Outros'
}
