import { createClient } from '@/lib/supabase/server'
import { MenuTable } from '@/components/admin/MenuTable'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
    const supabase = await createClient()

    const { data: items } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900">Gestão de Menu</h1>
            </div>

            <MenuTable initialItems={items || []} categories={categories || []} />
        </div>
    )
}
