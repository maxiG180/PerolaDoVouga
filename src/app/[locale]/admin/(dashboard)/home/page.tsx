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

    // ==================== NEW CALCULATIONS ====================
    // Profit Margin %
    const marginPercentage = monthRevenue > 0 ? ((monthRevenue - monthExpensesTotal) / monthRevenue) * 100 : 0

            // Daily Average Revenue
            const daysPassedInMonth = today.getDate()
            const dailyAverageRevenue = monthRevenue / daysPassedInMonth

            // ==================== EXPENSE BREAKDOWN ====================
            const {data: expensesByCategory } = await supabase
            .from('expenses')
            .select(`
            amount,
            expense_categories (
            name,
            color
            )
            `)
            .gte('expense_date', monthStart)
            .lte('expense_date', monthEnd)

            // Aggregate expenses by category
            const expenseTotals: Record<string, {amount: number, color: string }> = { }
    
    ;(expensesByCategory as any[])?.forEach((exp: any) => {
        const catName = exp.expense_categories?.name || 'Outros'
            const catColor = exp.expense_categories?.color || '#9ca3af'

            if (!expenseTotals[catName]) {
                expenseTotals[catName] = { amount: 0, color: catColor }
            }
            expenseTotals[catName].amount += Number(exp.amount)
    })

            // Sort by amount desc
            const sortedExpenses = Object.entries(expenseTotals)
        .sort(([, a], [, b]) => b.amount - a.amount)
            .slice(0, 4) // Top 4 categories

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

                {/* High Level Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Monthly Revenue */}
                    <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Receita (Mês)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">€{monthRevenue.toFixed(2)}</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Média diária: €{dailyAverageRevenue.toFixed(0)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Monthly Profit */}
                    <Card className="bg-white border-l-4 border-l-primary-500 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Lucro Líquido</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">€{monthProfit.toFixed(2)}</p>
                            <p className={`text-xs mt-1 font-medium ${marginPercentage >= 20 ? 'text-green-600' : marginPercentage >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                Margem Real: {marginPercentage.toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>

                    {/* Monthly Expenses */}
                    <Card className="bg-white border-l-4 border-l-red-500 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Despesas (Mês)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">€{monthExpensesTotal.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {((monthExpensesTotal / (monthRevenue || 1)) * 100).toFixed(0)}% da receita
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sales Today */}
                    <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Vendas Hoje</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">€{todayRevenue.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {todayQuantity} pedidos
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Expense Breakdown */}
                    <Card className="bg-white border border-gray-200 shadow-md lg:col-span-1 h-full">
                        <CardHeader className="border-b border-gray-100 bg-gray-50 py-3">
                            <CardTitle className="text-base font-bold text-gray-900">
                                Gastos por Categoria
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {sortedExpenses.length > 0 ? (
                                <div className="space-y-4">
                                    {sortedExpenses.map(([name, data]) => (
                                        <div key={name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{name}</span>
                                                <span className="font-bold text-gray-900">€{data.amount.toFixed(0)}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${(data.amount / monthExpensesTotal) * 100}%`,
                                                        backgroundColor: data.color || '#ef4444'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    Nenhuma despesa registada este mês
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top 3 Dishes - Spans 2 cols */}
                    <Card className="bg-white border border-gray-200 shadow-md lg:col-span-2 h-full">
                        <CardHeader className="border-b border-gray-100 bg-gray-50 py-3">
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                🏆 Pratos Mais Vendidos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {top3.length > 0 ? (
                                <div className="space-y-3">
                                    {top3.map(([name, quantity], index) => (
                                        <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm",
                                                    index === 0 && "bg-yellow-500 shadow-sm",
                                                    index === 1 && "bg-gray-400",
                                                    index === 2 && "bg-orange-500"
                                                )}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-gray-900">{name}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-bold text-gray-900">{quantity}</span>
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Vendas</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p className="font-medium text-sm">Sem dados de vendas</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            )
}
