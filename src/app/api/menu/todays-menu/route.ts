import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient() as any;
        const today = new Date().toISOString().split('T')[0];

        // 1. Get always-available items
        const { data: alwaysAvailable } = await supabase
            .from('menu_items')
            .select('*, categories(name)')
            .eq('is_always_available', true)
            .eq('is_available', true)
            .order('display_order');

        // 2. Get today's planning (soup + pratos)
        const { data: todayPlanning } = await supabase
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
            .eq('date', today)
            .maybeSingle();

        // 3. Get advance-order items
        const { data: advanceOrderItems } = await supabase
            .from('menu_items')
            .select('*, categories(name)')
            .eq('availability_type', 'advance_order')
            .eq('is_available', true)
            .order('display_order');

        return NextResponse.json({
            alwaysAvailable: alwaysAvailable || [],
            todaysSoup: todayPlanning?.soup || null,
            todaysPratos: todayPlanning?.daily_menu_items?.map((item: any) => ({
                ...item.menu_items,
                quantity_available: item.quantity_available,
                quantity_sold: item.quantity_sold,
                is_sold_out: item.is_sold_out,
                quantity_remaining: item.quantity_available
                    ? item.quantity_available - item.quantity_sold
                    : null,
            })) || [],
            advanceOrderItems: advanceOrderItems || [],
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
