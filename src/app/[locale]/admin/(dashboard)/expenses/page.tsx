'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ExpensesList } from '@/components/admin/expenses/ExpensesList'

export default function ExpensesPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [expenses, setExpenses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExpenses()
    }, [currentDate])

    const fetchExpenses = async () => {
        setLoading(true)
        const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd')
        const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd')

        try {
            const response = await fetch(`/api/expenses?start=${monthStart}&end=${monthEnd}`)
            const data = await response.json()
            setExpenses(data.expenses || [])
        } catch (error) {
            console.error('Error fetching expenses:', error)
            setExpenses([])
        } finally {
            setLoading(false)
        }
    }

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const goToCurrentMonth = () => setCurrentDate(new Date())

    const isCurrentMonth = format(currentDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Header with Month Navigation */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                            Despesas
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <Button
                                onClick={goToPreviousMonth}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/10 h-9 px-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <button
                                onClick={goToCurrentMonth}
                                className="text-sm sm:text-base text-white/90 hover:text-white font-medium min-w-[140px] hover:underline"
                            >
                                {format(currentDate, "MMMM 'de' yyyy", { locale: pt })}
                            </button>
                            <Button
                                onClick={goToNextMonth}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/10 h-9 px-2"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                            {!isCurrentMonth && (
                                <Button
                                    onClick={goToCurrentMonth}
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 text-xs bg-white/10 text-white border-white/30 hover:bg-white/20"
                                >
                                    Hoje
                                </Button>
                            )}
                        </div>
                    </div>
                    <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-gray-100 font-bold shadow-md transition-all hover:scale-105">
                        <Link href="/admin/expenses/add">
                            <Plus className="w-5 h-5 mr-2" />
                            Nova Despesa
                        </Link>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">A carregar...</p>
                </div>
            ) : (
                <ExpensesList expenses={expenses} onRefresh={fetchExpenses} />
            )}
        </div>
    )
}
