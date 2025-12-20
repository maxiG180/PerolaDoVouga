import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Receipt, Calendar, TrendingUp, Filter, Euro } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { pt } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
    const supabase = await createClient()
    const today = new Date()
    const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
    const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')

    // Fetch current month expenses
    const { data: rawExpenses } = await supabase
        .from('expenses')
        .select(`
            *,
            expense_categories (
                name,
                icon,
                color
            )
        `)
        .gte('expense_date', monthStart)
        .lte('expense_date', monthEnd)
        .order('expense_date', { ascending: false })

    const expenses = rawExpenses as any[]

    const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-900 flex items-center gap-2">
                        <Receipt className="w-8 h-8" />
                        Despesas
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {format(today, "MMMM 'de' yyyy", { locale: pt })}
                    </p>
                </div>
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 gap-2 min-h-[50px]">
                    <Link href="/admin/expenses/add">
                        <Plus className="w-5 h-5" />
                        Nova Despesa
                    </Link>
                </Button>
            </div>

            {/* Total Card */}
            <Card className="shadow-lg border-none bg-gradient-to-br from-red-50 to-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Euro className="w-5 h-5 text-red-600" />
                        Total Este Mês
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-red-600">
                        €{totalExpenses.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {expenses?.length || 0} {expenses?.length === 1 ? 'despesa' : 'despesas'}
                    </p>
                </CardContent>
            </Card>

            {/* Expenses List */}
            <div className="space-y-3">
                {expenses && expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <Card key={expense.id} className="shadow-md border-none hover:shadow-lg transition-all">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${expense.expense_categories?.color}20` }}
                                        >
                                            {expense.expense_categories?.icon || '📋'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-primary-900 truncate">
                                                {expense.expense_categories?.name || 'Outros'}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(expense.expense_date), "dd/MM/yyyy", { locale: pt })}
                                            </div>
                                            {expense.description && (
                                                <div className="text-xs text-muted-foreground mt-1 truncate">
                                                    {expense.description}
                                                </div>
                                            )}
                                            {expense.is_recurring && (
                                                <div className="text-xs text-blue-600 mt-1 font-medium">
                                                    🔄 Recorrente
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-xl font-bold text-red-600">
                                            €{Number(expense.amount).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="shadow-md border-none">
                        <CardContent className="p-8 text-center">
                            <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="font-semibold text-lg mb-2">Sem despesas este mês</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Comece a registar as suas despesas para ter controlo financeiro
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/admin/expenses/add">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Primeira Despesa
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
