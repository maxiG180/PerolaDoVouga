'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const EXPENSE_CATEGORIES = [
    { id: 'agua', name: 'Água', icon: '💧', color: '#3B82F6' },
    { id: 'gas', name: 'Gás', icon: '🔥', color: '#EF4444' },
    { id: 'luz', name: 'Luz', icon: '⚡', color: '#FBBF24' },
    { id: 'salario', name: 'Salário Cozinheira', icon: '👩‍🍳', color: '#8B5CF6' },
    { id: 'ss', name: 'Segurança Social', icon: '🏦', color: '#10B981' },
    { id: 'renda', name: 'Renda', icon: '🏠', color: '#6366F1' },
    { id: 'produtos', name: 'Produtos Alimentares', icon: '🛒', color: '#F59E0B' },
    { id: 'outros', name: 'Outros', icon: '📋', color: '#6B7280' },
]

export default function AddExpensePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [categoryId, setCategoryId] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    const [description, setDescription] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Validate
            if (!categoryId) {
                setError('Por favor selecione uma categoria')
                setLoading(false)
                return
            }
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                setError('Por favor insira um valor válido')
                setLoading(false)
                return
            }
            if (!date) {
                setError('Por favor selecione uma data')
                setLoading(false)
                return
            }

            // Submit to API
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_id: categoryId,
                    amount: Number(amount),
                    expense_date: format(date, 'yyyy-MM-dd'),
                    description: description || null,
                    is_recurring: isRecurring
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao guardar despesa')
            }

            router.push('/admin/expenses')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao guardar despesa')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Link href="/admin/expenses">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nova Despesa</h1>
                    <p className="text-sm text-gray-600">Selecione a categoria</p>
                </div>
            </div>

            {/* Quick Category Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EXPENSE_CATEGORIES.slice(0, 8).map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={cn(
                            "p-4 rounded-xl border-2 transition-all text-left",
                            "hover:scale-[1.02] active:scale-[0.98]",
                            categoryId === cat.id
                                ? "border-red-600 bg-red-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        )}
                    >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div className="font-medium text-sm text-gray-900">{cat.name}</div>
                    </button>
                ))}
            </div>

            {/* Form */}
            {categoryId && (
                <Card className="shadow-xl border border-gray-200 bg-white">
                    <CardContent className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-base font-medium">
                                    Valor (€) *
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-14 text-2xl font-bold border-gray-300 focus:border-primary-900 focus:ring-primary-900"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">Data</Label>
                                <DatePicker
                                    value={date}
                                    onChange={(newDate) => newDate && setDate(newDate)}
                                    label={format(date, "dd/MM/yyyy")}
                                />
                            </div>

                            {/* Recurring - More Prominent */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="recurring"
                                        checked={isRecurring}
                                        onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                                        className="w-5 h-5"
                                    />
                                    <Label htmlFor="recurring" className="text-base font-semibold cursor-pointer text-gray-900">
                                        🔄 Despesa Recorrente
                                    </Label>
                                </div>
                                {isRecurring && (
                                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                                        Mensal
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-600">
                                    Nota (opcional)
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detalhes adicionais..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="border-gray-300 focus:border-primary-900 focus:ring-primary-900 text-sm"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-14 text-xl gap-2 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    'A guardar...'
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
