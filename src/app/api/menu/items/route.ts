import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('menu_items')
            .select('id, name, price, category_id')
            .eq('is_available', true)
            .order('name')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
