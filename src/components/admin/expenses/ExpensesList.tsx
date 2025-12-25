'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { SearchBar } from '@/components/ui/search-bar'

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

    const filteredExpenses = expenses.filter(expense => {
        const term = search.toLowerCase()
        return (
            expense.description?.toLowerCase().includes(term) ||
            expense.expense_categories?.name.toLowerCase().includes(term) ||
            expense.amount.toString().includes(term)
        )
    })

    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

    return (
        <div className="space-y-4">
            <div className="w-full max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Procurar despesas..."
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-300 min-w-[600px]">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Data</div>
                        <div className="col-span-3 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Categoria</div>
                        <div className="col-span-4 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">Descrição</div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-right">Valor</div>
                        <div className="col-span-1 px-4 py-3 font-bold text-sm text-gray-700 text-center">🔄</div>
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
                            <p className="font-medium">Nenhuma despesa encontrada</p>
                        </div>
                    )}
                </div>

                {/* Table Footer - Totals */}
                {filteredExpenses.length > 0 && (
                    <div className="bg-gray-100 border-t-2 border-gray-400">
                        <div className="grid grid-cols-12 gap-0">
                            <div className="col-span-9 px-4 py-3 font-bold text-sm text-gray-900 border-r border-gray-300">
                                TOTAL
                            </div>
                            <div className="col-span-2 px-4 py-3 font-bold text-base text-red-700 border-r border-gray-300 text-right">
                                €{totalExpenses.toFixed(2)}
                            </div>
                            <div className="col-span-1 px-4 py-3 text-sm text-center text-gray-600">
                                {filteredExpenses.filter(e => e.is_recurring).length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
