import { createClient } from '@/lib/supabase/server'
import { DishList } from '@/components/admin/menu/DishList'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
    const supabase = await createClient()

    const { data: items } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900 mt-4">Gestão de Menu</h1>
            </div>

            <DishList initialItems={items || []} />
        </div>
    )
}
