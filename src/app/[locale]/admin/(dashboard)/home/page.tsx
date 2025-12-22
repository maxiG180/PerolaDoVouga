import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Euro, ShoppingCart, Receipt, TrendingUp as ChartIcon } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import { SmartInsights } from '@/components/admin/dashboard/SmartInsights'

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

    // 2. Missing Plan for Tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')

    const { data: planData } = await supabase
        .from('daily_menus')
        .select('id')
        .eq('date', tomorrowStr)
        .single()

    const missingPlan = !planData

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    Gestão Interna
                </h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                    {format(today, "EEEE, d 'de' MMMM", { locale: pt })}
                </p>
            </div>

            {/* Smart Insights Section */}
            <SmartInsights
                lowMarginItems={lowMarginCount || 0}
                missingPlan={missingPlan}
                salesTrend="stable"
                topDishName={top3[0]?.[0] || ''}
            />

            {/* Top Row: Hoje + Esta Semana */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* HOJE */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <CardHeader className="pb-3 relative">
                        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2 text-blue-100">
                            <ShoppingCart className="w-5 h-5" />
                            Hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 relative">
                        <div className="text-4xl md:text-5xl font-bold">
                            €{todayRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm md:text-base text-blue-100 font-medium">
                            {todayQuantity} {todayQuantity === 1 ? 'pedido' : 'pedidos'}
                        </p>
                    </CardContent>
                </Card>

                {/* ESTA SEMANA */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <CardHeader className="pb-3 relative">
                        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2 text-purple-100">
                            <ChartIcon className="w-5 h-5" />
                            Esta Semana
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 relative">
                        <div className="text-4xl md:text-5xl font-bold">
                            €{weekRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm md:text-base text-purple-100 font-medium">
                            {format(startOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')} - {format(endOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ESTE MÊS - Full Width */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-green-50/30 to-white overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100/20 rounded-full -mr-32 -mb-32" />
                <CardHeader className="relative">
                    <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2 text-primary-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Euro className="w-6 h-6 text-white" />
                        </div>
                        Este Mês
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-2xl border border-green-100">
                            <p className="text-sm md:text-base text-gray-600 mb-1.5 font-medium">Receita</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">€{monthRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-2xl border border-red-100">
                            <p className="text-sm md:text-base text-gray-600 mb-1.5 font-medium">Despesas</p>
                            <p className="text-2xl md:text-3xl font-bold text-red-600">€{monthExpensesTotal.toFixed(2)}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-primary-900 to-primary-800 p-4 md:p-6 rounded-2xl shadow-lg">
                            <p className="text-sm md:text-base text-white/80 mb-1.5 flex items-center gap-2 font-medium">
                                Lucro
                                {monthProfit > 0 ? (
                                    <TrendingUp className="w-5 h-5 text-green-300" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-red-300" />
                                )}
                            </p>
                            <p className="text-3xl md:text-4xl font-bold text-white">
                                €{monthProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm md:text-base text-gray-600 font-medium">
                            📊 {monthOrders} vendas este mês
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* TOP 3 PRATOS */}
            <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2 text-primary-900">
                        🏆 Top 3 Pratos (Este Mês)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {top3.length > 0 ? (
                        <div className="space-y-3">
                            {top3.map(([name, quantity], index) => (
                                <div key={name} className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-gradient-to-r from-beige-50 to-white border border-beige-100 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : 'bg-gradient-to-br from-orange-500 to-orange-600'}
                                        `}>
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold text-base md:text-lg text-primary-900">{name}</span>
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-primary-900 bg-beige-100 px-4 py-2 rounded-xl">{quantity}x</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Receipt className="w-16 h-16 mx-auto mb-3 opacity-30" />
                            <p className="text-base font-medium">Ainda não há vendas registadas este mês.</p>
                            <p className="text-sm mt-2">Comece a registar vendas para ver estatísticas!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
