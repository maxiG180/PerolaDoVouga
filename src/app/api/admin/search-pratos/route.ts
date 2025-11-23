import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get('search') || '';
        const categories = searchParams.get('categories')?.split(',') || [];
        const cuisines = searchParams.get('cuisines')?.split(',') || [];

        let query = supabase
            .from('menu_items')
            .select('*, categories(name)')
            .eq('daily_type', 'dish')
            .eq('is_available', true);

        // Search term
        if (searchTerm) {
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Category filters
        if (categories.length > 0) {
            query = query.in('categories.name', categories);
        }

        // Cuisine filters
        if (cuisines.length > 0) {
            query = query.in('cuisine_type', cuisines);
        }

        query = query.order('name');

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ pratos: data });
    } catch (error) {
        console.error('Error searching pratos:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
