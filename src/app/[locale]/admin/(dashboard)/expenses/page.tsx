import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ExpensesList } from '@/components/admin/expenses/ExpensesList'

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

    const expenses = rawExpenses as any[] || []

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                        Despesas
                    </h1>
                    <p className="text-sm sm:text-base text-white/80">
                        {format(today, "MMMM 'de' yyyy", { locale: pt })}
                    </p>
                </div>
                <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-gray-100 font-bold shadow-md transition-all hover:scale-105">
                    <Link href="/admin/expenses/add">
                        <Plus className="w-5 h-5 mr-2" />
                        Nova Despesa
                    </Link>
                </Button>
            </div>

            <ExpensesList expenses={expenses} />
        </div>
    )
}
