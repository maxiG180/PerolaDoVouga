import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLocalDate } from '@/lib/utils';

export async function GET() {
    try {
        const supabase = await createClient() as any;
        const today = getLocalDate();

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

        const todaysSoups = [];
        if (todayPlanning?.soup) {
            todaysSoups.push(todayPlanning.soup);
        }

        const todaysPratos: any[] = [];
        todayPlanning?.daily_menu_items?.forEach((item: any) => {
            const menuItem = {
                ...item.menu_items,
                quantity_available: item.quantity_available,
                quantity_sold: item.quantity_sold,
                is_sold_out: item.is_sold_out,
                quantity_remaining: item.quantity_available
                    ? item.quantity_available - item.quantity_sold
                    : null,
            };

            if (item.menu_items?.daily_type === 'soup') {
                // If it's not already the primary soup, add it to soups
                if (item.menu_item_id !== todayPlanning.soup_id) {
                    todaysSoups.push(menuItem);
                }
            } else {
                todaysPratos.push(menuItem);
            }
        });

        return NextResponse.json({
            alwaysAvailable: alwaysAvailable || [],
            todaysSoup: todaysSoups[0] || null, // Keep for compatibility
            todaysSoups: todaysSoups,
            todaysPratos: todaysPratos,
            advanceOrderItems: advanceOrderItems || [],
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
