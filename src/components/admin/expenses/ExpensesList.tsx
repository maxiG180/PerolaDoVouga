'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { SearchBar } from '@/components/ui/search-bar'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Expense {
    id: number
    expense_date: string
    description: string
    amount: number
    is_recurring: boolean
    expense_categories: {
        name: string
        icon: string
        color: string
    } | null
}

interface ExpensesListProps {
    expenses: Expense[]
}

export function ExpensesList({ expenses }: ExpensesListProps) {
    const [search, setSearch] = useState('')
    const [deleting, setDeleting] = useState<number | null>(null)
    const router = useRouter()
    const supabase = createClient() as any

    const filteredExpenses = expenses.filter(expense => {
        const term = search.toLowerCase()
        return (
            expense.description?.toLowerCase().includes(term) ||
            expense.expense_categories?.name.toLowerCase().includes(term) ||
            expense.amount.toString().includes(term)
        )
    })

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja eliminar esta despesa?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success('Despesa eliminada com sucesso')
            router.refresh()
        } catch (error) {
            console.error('Error deleting expense:', error)
            toast.error('Erro ao eliminar despesa')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="w-full max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Procurar despesas..."
                />
            </div>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-300">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Data</div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Categoria</div>
                        <div className="col-span-3 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Descrição</div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-right">Valor</div>
                        <div className="col-span-1 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-center">🔄</div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 text-center">Ações</div>
                    </div>
                </div>

                {/* Table Body */}
                <div>
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense, index) => (
                            <div
                                key={expense.id}
                                className={`grid grid-cols-12 gap-0 border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
                            >
                                <div className="col-span-2 px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                    {format(new Date(expense.expense_date), "dd/MM/yyyy")}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm border-r border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{expense.expense_categories?.icon || '📋'}</span>
                                        <span className="font-medium text-gray-900">
                                            {expense.expense_categories?.name || 'Outros'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-3 px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                                    {expense.description || '-'}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm font-bold text-red-600 border-r border-gray-200 text-right">
                                    €{Number(expense.amount).toFixed(2)}
                                </div>
                                <div className="col-span-1 px-4 py-3 text-sm border-r border-gray-200 text-center">
                                    {expense.is_recurring ? '✓' : ''}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm text-center flex gap-1 justify-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => router.push(`/admin/expenses/${expense.id}/edit`)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDelete(expense.id)}
                                        disabled={deleting === expense.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 text-center text-gray-500">
                            <p className="font-medium">Nenhuma despesa encontrada</p>
                        </div>
                    )}
                </div>

                {/* Table Footer - Totals */}
                {filteredExpenses.length > 0 && (
                    <div className="bg-gray-100 border-t-2 border-gray-400">
                        <div className="grid grid-cols-12 gap-0">
                            <div className="col-span-7 px-4 py-3 font-bold text-sm text-gray-900 border-r border-gray-300">
                                TOTAL
                            </div>
                            <div className="col-span-2 px-4 py-3 font-bold text-base text-red-700 border-r border-gray-300 text-right">
                                €{totalExpenses.toFixed(2)}
                            </div>
                            <div className="col-span-1 px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-300">
                                {filteredExpenses.filter(e => e.is_recurring).length}
                            </div>
                            <div className="col-span-2 px-4 py-3"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Card View - Hidden on desktop */}
            <div className="md:hidden space-y-3">
                {filteredExpenses.length > 0 ? (
                    <>
                        {filteredExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                            >
                                {/* Card Header with Category */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{expense.expense_categories?.icon || '📋'}</span>
                                            <span className="font-bold text-gray-900">
                                                {expense.expense_categories?.name || 'Outros'}
                                            </span>
                                        </div>
                                        {expense.is_recurring && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                                🔄 Recorrente
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="px-4 py-3 space-y-2">
                                    {/* Amount - Most Important */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Valor</span>
                                        <span className="text-2xl font-bold text-red-600">
                                            €{Number(expense.amount).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Data</span>
                                        <span className="font-medium text-gray-900">
                                            {format(new Date(expense.expense_date), "dd/MM/yyyy")}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {expense.description && (
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Nota:</span> {expense.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer with Actions */}
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-11 gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                        onClick={() => router.push(`/admin/expenses/${expense.id}/edit`)}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-11 gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                        onClick={() => handleDelete(expense.id)}
                                        disabled={deleting === expense.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Mobile Total Summary */}
                        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-lg p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Total do Mês</p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {filteredExpenses.filter(e => e.is_recurring).length} recorrentes
                                    </p>
                                </div>
                                <span className="text-3xl font-bold text-red-700">
                                    €{totalExpenses.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="px-4 py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                        <p className="font-medium">Nenhuma despesa encontrada</p>
                    </div>
                )}
            </div>
        </div>
    )
}
