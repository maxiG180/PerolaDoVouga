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
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900">Gestão Interna</h1>
                <p className="text-sm text-muted-foreground">
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
            <div className="grid md:grid-cols-2 gap-4">
                {/* HOJE */}
                <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                            Hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-bold text-blue-600">
                            €{todayRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {todayQuantity} {todayQuantity === 1 ? 'pedido' : 'pedidos'}
                        </p>
                    </CardContent>
                </Card>

                {/* ESTA SEMANA */}
                <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ChartIcon className="w-5 h-5 text-purple-600" />
                            Esta Semana
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-bold text-purple-600">
                            €{weekRevenue.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {format(startOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')} - {format(endOfWeek(today, { weekStartsOn: 1 }), 'dd/MM')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ESTE MÊS - Full Width */}
            <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 via-white to-green-50">
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Euro className="w-6 h-6 text-green-600" />
                        Este Mês
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Receita</p>
                            <p className="text-2xl font-bold text-green-600">€{monthRevenue.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Despesas</p>
                            <p className="text-2xl font-bold text-red-600">€{monthExpensesTotal.toFixed(2)}</p>
                        </div>
                        <div className="md:border-l md:pl-4">
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                                Lucro
                                {monthProfit > 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                            </p>
                            <p className={`text-3xl font-bold ${monthProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                €{monthProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                            {monthOrders} vendas este mês
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* TOP 3 PRATOS */}
            <Card className="shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        🏆 Top 3 Pratos (Este Mês)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {top3.length > 0 ? (
                        <div className="space-y-3">
                            {top3.map(([name, quantity], index) => (
                                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                                            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}
                                        `}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-primary-900">{name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-primary-900">{quantity}x</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Ainda não há vendas registadas este mês.</p>
                            <p className="text-sm mt-1">Comece a registar vendas para ver estatísticas!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions - Mobile Optimized */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a href="/admin/expenses" className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2 text-center min-h-[100px] justify-center">
                    <Receipt className="w-8 h-8 text-red-600" />
                    <span className="text-sm font-medium text-primary-900">Despesas</span>
                </a>
                <a href="/admin/sales" className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2 text-center min-h-[100px] justify-center">
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                    <span className="text-sm font-medium text-primary-900">Vendas</span>
                </a>
                <a href="/admin/margins" className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2 text-center min-h-[100px] justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-primary-900">Margens</span>
                </a>
                <a href="/admin/planning" className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2 text-center min-h-[100px] justify-center">
                    <ChartIcon className="w-8 h-8 text-purple-600" />
                    <span className="text-sm font-medium text-primary-900">Planeamento</span>
                </a>
            </div>
        </div>
    )
}
