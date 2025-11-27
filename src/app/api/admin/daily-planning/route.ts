import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient() as any;
        const { date, soupId, selectedPratos, notes } = await req.json();

        // 1. Upsert daily_menu_planning
        const { data: planning, error: planningError } = await supabase
            .from('daily_menu_planning')
            .upsert({
                date: date,
                soup_id: soupId,
                notes: notes,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'date' })
            .select()
            .single();

        if (planningError) {
            return NextResponse.json({ error: planningError.message }, { status: 500 });
        }

        // 2. Delete existing daily_menu_items for this planning
        await supabase
            .from('daily_menu_items')
            .delete()
            .eq('planning_id', planning.id);

        // 3. Insert new daily_menu_items
        if (selectedPratos && selectedPratos.length > 0) {
            const items = selectedPratos.map((prato: { id: string; quantity?: number }) => ({
                planning_id: planning.id,
                menu_item_id: prato.id,
                quantity_available: prato.quantity || null,
                quantity_sold: 0,
                is_sold_out: false,
            }));

            const { error: itemsError } = await supabase
                .from('daily_menu_items')
                .insert(items);

            if (itemsError) {
                return NextResponse.json({ error: itemsError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, planning });
    } catch (error) {
        console.error('Error saving daily planning:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient() as any;
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
        }

        const { data: planning, error } = await supabase
            .from('daily_menu_planning')
            .select(`
        *,
        soup:soup_id (
          id,
          name,
          name_en,
          price,
          description,
          image_url
        ),
        daily_menu_items (
          menu_item_id,
          quantity_available,
          quantity_sold,
          is_sold_out,
          menu_items (
            id,
            name,
            name_en,
            price,
            description,
            image_url,
            cuisine_type,
            categories(name)
          )
        )
      `)
            .eq('date', date)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ planning });
    } catch (error) {
        console.error('Error fetching daily planning:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
