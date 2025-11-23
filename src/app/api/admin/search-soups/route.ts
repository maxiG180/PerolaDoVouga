import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get('search') || '';

        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('daily_type', 'soup')
            .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
            .order('name');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ soups: data });
    } catch (error) {
        console.error('Error searching soups:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
