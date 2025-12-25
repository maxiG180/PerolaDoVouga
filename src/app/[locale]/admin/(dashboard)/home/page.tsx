import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Euro, ShoppingCart, Receipt, TrendingUp as ChartIcon } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import { SmartInsights } from '@/components/admin/dashboard/SmartInsights'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const today = new Date()

    // Date ranges
    const todayStr = format(today, 'yyyy-MM-dd')
    const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
    const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')

    // ==================== VENDAS HOJE ====================
    const { data: todaySales } = await supabase
        .from('sales_log')
        .select('total_price, quantity')
        .eq('sale_date', todayStr)

    const todayRevenue = (todaySales as any)?.reduce((sum: number, sale: any) => sum + Number(sale.total_price), 0) || 0
    const todayQuantity = (todaySales as any)?.reduce((sum: number, sale: any) => sum + sale.quantity, 0) || 0

    // ==================== VENDAS ESTA SEMANA ====================
    const { data: weekSales } = await supabase
        .from('sales_log')
        .select('total_price')
        .gte('sale_date', weekStart)
        .lte('sale_date', weekEnd)

    const weekRevenue = (weekSales as any)?.reduce((sum: number, sale: any) => sum + Number(sale.total_price), 0) || 0

    // ==================== ESTE MÊS: RECEITA + DESPESAS ====================
    const { data: monthSales } = await supabase
        .from('sales_log')
        .select('total_price, quantity')
        .gte('sale_date', monthStart)
        .lte('sale_date', monthEnd)

    const monthRevenue = (monthSales as any)?.reduce((sum: number, sale: any) => sum + Number(sale.total_price), 0) || 0
    const monthOrders = (monthSales as any)?.reduce((sum: number, sale: any) => sum + sale.quantity, 0) || 0

    const { data: monthExpenses } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', monthStart)
        .lte('expense_date', monthEnd)

    const monthExpensesTotal = (monthExpenses as any)?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0
    const monthProfit = monthRevenue - monthExpensesTotal

    // ==================== TOP 3 PRATOS ====================
    const { data: topDishes } = await supabase
        .from('sales_log')
        .select('item_name, quantity')
        .gte('sale_date', monthStart)
        .lte('sale_date', monthEnd)

    // Aggregate by item name
    const dishTotals = (topDishes as any[])?.reduce((acc: Record<string, number>, sale: any) => {
        acc[sale.item_name] = (acc[sale.item_name] || 0) + sale.quantity
        return acc
    }, {}) || {}

    const top3 = Object.entries(dishTotals)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)

    // ==================== SMART INSIGHTS DATA ====================
    // 1. Low Margin Items
    const { count: lowMarginCount } = await supabase
        .from('recipe_costs')
        .select('*', { count: 'exact', head: true })
        .lt('margin_percentage', 30)



    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                    Gestão Interna
                </h1>
                <p className="text-sm sm:text-base text-white/80">
                    {format(today, "EEEE, d 'de' MMMM", { locale: pt })}
                </p>
            </div>

            {/* Smart Insights Section */}
            <SmartInsights
                lowMarginItems={lowMarginCount || 0}
                salesTrend="stable"
                topDishName={top3[0]?.[0] || ''}
            />

            {/* Today & This Week Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Today */}
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-900 mb-1">
                            €{todayRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm text-emerald-700">
                            {todayQuantity} {todayQuantity === 1 ? 'pedido' : 'pedidos'}
                        </p>
                    </CardContent>
                </Card>

                {/* This Week */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            <ChartIcon className="w-4 h-4" />
                            Esta Semana
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-900 mb-1">
                            €{weekRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm text-blue-700">
                            {format(startOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')} - {format(endOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* This Month Stats */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Euro className="w-5 h-5" />
                        Este Mês
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Receita</p>
                            <p className="text-2xl font-bold text-green-700">€{monthRevenue.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Despesas</p>
                            <p className="text-2xl font-bold text-red-700">€{monthExpensesTotal.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-primary-900 rounded-lg">
                            <p className="text-sm font-medium text-white/90 mb-1 flex items-center gap-1">
                                Lucro
                                {monthProfit > 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                            </p>
                            <p className="text-2xl font-bold text-white">
                                €{monthProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            📊 {monthOrders} vendas este mês
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Top 3 Dishes */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        🏆 Top 3 Pratos (Este Mês)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {top3.length > 0 ? (
                        <div className="space-y-2">
                            {top3.map(([name, quantity], index) => (
                                <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white",
                                            index === 0 && "bg-yellow-500",
                                            index === 1 && "bg-gray-400",
                                            index === 2 && "bg-orange-500"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-gray-900">{name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{quantity}x</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="font-medium">Ainda não há vendas registadas este mês.</p>
                            <p className="text-sm mt-1">Comece a registar vendas para ver estatísticas!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
