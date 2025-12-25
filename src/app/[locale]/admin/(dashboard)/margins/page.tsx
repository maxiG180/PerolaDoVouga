import { createClient } from '@/lib/supabase/server'
import { TrendingUp } from 'lucide-react'
import { MarginsList } from '@/components/admin/margins/MarginsList'

export const dynamic = 'force-dynamic'

export default async function MarginsPage() {
    const supabase = await createClient()

    // Fetch data similar to API but server-side
    const { data: items } = await supabase
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
        .eq('is_available', true)
        .order('name')

    // Process data
    const marginItems = (items as any[])?.map(item => {
        // recipe_costs is returned as an array by supabase join
        // @ts-ignore - Supabase type definition quirk with joins
        const costData = item.recipe_costs?.[0] || item.recipe_costs

        const sellingPrice = costData?.selling_price ?? item.price
        const cost = costData?.ingredient_cost ?? 0
        // Calculate margin manually if not present (fallback)
        const margin = costData?.margin_percentage ??
            (sellingPrice > 0 ? ((sellingPrice - cost) / sellingPrice) * 100 : 0)

        // Ensure status type safety
        let status: 'excellent' | 'good' | 'warning' | 'critical' = 'critical'
        if (margin >= 70) status = 'excellent'
        else if (margin >= 50) status = 'good'
        else if (margin >= 30) status = 'warning'

        return {
            id: item.id,
            name: item.name,
            sellingPrice,
            cost,
            margin: Number(margin),
            status
        }
    }) || []

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 shadow-lg mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                    Margens de Lucro
                </h1>
                <p className="text-white/80 mt-2 text-sm sm:text-base">
                    Analise a rentabilidade de cada prato do menu.
                </p>
            </div>

            <MarginsList items={marginItems} />
        </div>
    )
}
