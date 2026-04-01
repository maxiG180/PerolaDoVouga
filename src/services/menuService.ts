
import { createClient } from '@/lib/supabase/server';
import { getLocalDate } from '@/lib/utils';

export async function getTodaysMenuData() {
    try {
        const supabase = await createClient(true) as any;
        const today = getLocalDate();
        const todaysSoups: any[] = [];
        const todaysPratos: any[] = [];

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
                        categories(name),
                        daily_type
                    )
                )
            `)
            .eq('date', today)
            .maybeSingle();

        if (todayPlanning?.soup) {
            todaysSoups.push(todayPlanning.soup);
        }

        todayPlanning?.daily_menu_items?.forEach((item: any) => {
            if (!item.menu_items) return;

            const menuItem = {
                ...item.menu_items,
                quantity_available: item.quantity_available,
                quantity_sold: item.quantity_sold,
                is_sold_out: item.is_sold_out,
                quantity_remaining: item.quantity_available
                    ? item.quantity_available - item.quantity_sold
                    : null,
            };

            // If it's the primary soup, or of type soup
            if (item.menu_item_id === todayPlanning.soup_id || (item.menu_items as any)?.daily_type === 'soup') {
                if (!todaysSoups.find(s => s.id === menuItem.id)) {
                    todaysSoups.push(menuItem);
                }
            } else {
                if (!todaysPratos.find(p => p.id === menuItem.id)) {
                    todaysPratos.push(menuItem);
                }
            }
        });

        const displayedIds = new Set<string>();
        todaysSoups.forEach(s => displayedIds.add(s.id));
        todaysPratos.forEach(p => displayedIds.add(p.id));

        // 3. Get advance-order items and filter out any that are already in today's special sections
        const { data: advanceOrderData } = await (supabase
            .from('menu_items')
            .select('*, categories(name)')
            .eq('availability_type', 'advance_order')
            .eq('is_available', true)
            .order('display_order') as any);

        const advanceOrderItems = (advanceOrderData || []).filter((item: any) => !displayedIds.has(item.id));

        return {
            alwaysAvailable: [], // HIDDEN per user request
            todaysSoup: todaysSoups[0] || null,
            todaysSoups: todaysSoups,
            todaysPratos: todaysPratos,
            advanceOrderItems: advanceOrderItems,
        };
    } catch (error) {
        console.error('Error fetching menu service:', error);
        return {
            alwaysAvailable: [],
            todaysSoup: null,
            todaysSoups: [],
            todaysPratos: [],
            advanceOrderItems: [],
        };
    }
}
