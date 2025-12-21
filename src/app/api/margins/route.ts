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

        // Fetch menu items joined with recipe costs
        // We use left join logic by selecting from menu_items and joining recipe_costs
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                id,
                name,
                price,
                recipe_costs (
                    id,
                    ingredient_cost,
                    margin_percentage,
                    selling_price
                )
            `)
            .order('name')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Format data for frontend
        // Type assertion needed due to Supabase type inference issue with joins
        const formattedData = (data as any[]).map((item: any) => {
            const cost = item.recipe_costs?.[0]

            // If we have a cost entry, use it. Otherwise default to item price as selling price and 0 cost
            return {
                id: item.id,
                name: item.name,
                selling_price: cost?.selling_price ?? item.price,
                ingredient_cost: cost?.ingredient_cost ?? 0,
                margin_percentage: cost?.margin_percentage ?? 100, // 0 cost = 100% margin
                recipe_cost_id: cost?.id
            }
        })

        return NextResponse.json(formattedData)
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
        const { menu_item_id, ingredient_cost, selling_price } = body

        if (!menu_item_id || ingredient_cost === undefined || selling_price === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Upsert into recipe_costs
        const { data, error } = await supabase
            .from('recipe_costs')
            .upsert({
                menu_item_id,
                ingredient_cost,
                selling_price,
                updated_by: user.id,
                last_updated: new Date().toISOString()
            } as any, { onConflict: 'menu_item_id' })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Optionally update the main menu_item price to match sending price?
        // Let's decide to keep them in sync
        const { error: menuError } = await (supabase as any)
            .from('menu_items')
            .update({ price: selling_price })
            .eq('id', menu_item_id)

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
