import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, AlertCircle, Edit } from 'lucide-react'
import Link from 'next/link'

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

        return {
            id: item.id,
            name: item.name,
            sellingPrice,
            cost,
            margin: Number(margin),
            status: margin >= 70 ? 'excellent' : margin >= 50 ? 'good' : margin >= 30 ? 'warning' : 'critical'
        }
    }) || []

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900 flex items-center gap-2">
                    <TrendingUp className="w-8 h-8" />
                    Margens de Lucro
                </h1>
            </div>

            <div className="grid gap-4">
                {marginItems.map((item) => (
                    <Card key={item.id} className="shadow-md border-none overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`h-2 w-full ${item.status === 'excellent' ? 'bg-emerald-500' :
                            item.status === 'good' ? 'bg-green-500' :
                                item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-primary-900 mb-1">{item.name}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <span>Venda: <span className="font-semibold text-primary-900">€{item.sellingPrice.toFixed(2)}</span></span>
                                        <span>Custo: <span className="font-semibold text-red-600">€{item.cost.toFixed(2)}</span></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${item.status === 'critical' ? 'text-red-600' :
                                        item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {item.margin.toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Margem</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {item.status === 'critical' && (
                                        <Badge variant="destructive" className="flex gap-1">
                                            <AlertCircle className="w-3 h-3" /> Crítico
                                        </Badge>
                                    )}
                                    {item.status === 'warning' && (
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                            Atenção
                                        </Badge>
                                    )}
                                    {item.status === 'good' && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                            Bom
                                        </Badge>
                                    )}
                                    {item.status === 'excellent' && (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                            Excelente
                                        </Badge>
                                    )}
                                </div>
                                <Button asChild size="sm" variant="outline" className="gap-2 h-10 px-4">
                                    <Link href={`/admin/margins/${item.id}/edit`}>
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {marginItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum prato encontrado no menu.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
