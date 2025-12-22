import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
                    <p className="text-sm text-gray-600">
                        {format(today, "MMMM 'de' yyyy", { locale: pt })}
                    </p>
                </div>
                <Button asChild size="default" className="bg-red-600 hover:bg-red-700 gap-2">
                    <Link href="/admin/expenses/add">
                        <Plus className="w-4 h-4" />
                        Nova Despesa
                    </Link>
                </Button>
            </div>

            {/* Excel-Style Table */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-100 border-b border-gray-300">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">
                            Data
                        </div>
                        <div className="col-span-3 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">
                            Categoria
                        </div>
                        <div className="col-span-4 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">
                            Descrição
                        </div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-right">
                            Valor
                        </div>
                        <div className="col-span-1 px-4 py-3 font-bold text-sm text-gray-700 text-center">
                            🔄
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div>
                    {expenses && expenses.length > 0 ? (
                        expenses.map((expense, index) => (
                            <div
                                key={expense.id}
                                className={`grid grid-cols-12 gap-0 border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                                    }`}
                            >
                                <div className="col-span-2 px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                    {format(new Date(expense.expense_date), "dd/MM/yyyy")}
                                </div>
                                <div className="col-span-3 px-4 py-3 text-sm border-r border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{expense.expense_categories?.icon || '📋'}</span>
                                        <span className="font-medium text-gray-900">
                                            {expense.expense_categories?.name || 'Outros'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-4 px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                                    {expense.description || '-'}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm font-bold text-red-600 border-r border-gray-200 text-right">
                                    €{Number(expense.amount).toFixed(2)}
                                </div>
                                <div className="col-span-1 px-4 py-3 text-sm text-center">
                                    {expense.is_recurring ? '✓' : ''}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 text-center text-gray-500">
                            <p className="font-medium">Sem despesas este mês</p>
                            <p className="text-sm mt-1">Clique em "Nova Despesa" para adicionar</p>
                        </div>
                    )}
                </div>

                {/* Table Footer - Totals */}
                {expenses && expenses.length > 0 && (
                    <div className="bg-gray-100 border-t-2 border-gray-400">
                        <div className="grid grid-cols-12 gap-0">
                            <div className="col-span-9 px-4 py-3 font-bold text-sm text-gray-900 border-r border-gray-300">
                                TOTAL
                            </div>
                            <div className="col-span-2 px-4 py-3 font-bold text-base text-red-700 border-r border-gray-300 text-right">
                                €{totalExpenses.toFixed(2)}
                            </div>
                            <div className="col-span-1 px-4 py-3 text-sm text-center text-gray-600">
                                {expenses.filter(e => e.is_recurring).length}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics */}
            {expenses && expenses.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                            <span>Total de despesas:</span>
                            <span className="font-medium text-gray-900">{expenses.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Despesas recorrentes:</span>
                            <span className="font-medium text-gray-900">
                                {expenses.filter(e => e.is_recurring).length}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="font-bold text-gray-900">Valor total:</span>
                            <span className="font-bold text-red-600">€{totalExpenses.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
