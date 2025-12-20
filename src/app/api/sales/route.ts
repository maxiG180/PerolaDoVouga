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

        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')

        let query = supabase
            .from('sales_log')
            .select('*')
            .order('sale_date', { ascending: false })

        if (startDate) {
            query = query.gte('sale_date', startDate)
        }
        if (endDate) {
            query = query.lte('sale_date', endDate)
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
        const { menu_item_id, item_name, quantity, unit_price, sale_date } = body

        // Validate
        if (!menu_item_id || !item_name || !quantity || !unit_price || !sale_date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
            return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
        }

        if (isNaN(Number(unit_price)) || Number(unit_price) < 0) {
            return NextResponse.json({ error: 'Price must be a non-negative number' }, { status: 400 })
        }

        // Insert sale
        const { data, error } = await supabase
            .from('sales_log')
            .insert([{
                menu_item_id,
                item_name,
                quantity: Number(quantity),
                unit_price: Number(unit_price),
                sale_date,
                created_by: user.id
            }])
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating sale:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
