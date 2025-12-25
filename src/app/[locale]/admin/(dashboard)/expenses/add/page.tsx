'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, ArrowLeft, Save } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
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
                    <p className="text-sm text-gray-600">Preencha os dados da despesa</p>
                </div>
            </div>

            {/* Form */}
            <Card className="shadow-xl border border-gray-200 bg-white">
                <CardContent className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-base font-medium">
                                Categoria *
                            </Label>
                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                <SelectTrigger className="h-12 border-gray-300 focus:border-primary-900 focus:ring-primary-900">
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EXPENSE_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            <span className="flex items-center gap-2">
                                                <span>{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                className="h-12 text-lg border-gray-300 focus:border-primary-900 focus:ring-primary-900"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Data *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 text-left font-normal justify-start border-gray-300 hover:bg-gray-50",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: pt }) : <span>Selecione a data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-3 bg-white shadow-xl border border-gray-200" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => newDate && setDate(newDate)}
                                        locale={pt}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-base font-medium">
                                Nota (opcional)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Detalhes adicionais..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="border-gray-300 focus:border-primary-900 focus:ring-primary-900"
                            />
                        </div>

                        {/* Recurring */}
                        <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                            <Checkbox
                                id="recurring"
                                checked={isRecurring}
                                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                            />
                            <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
                                🔄 Despesa Recorrente (mensal)
                            </Label>
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
                            className="w-full h-12 text-lg gap-2 bg-red-600 hover:bg-red-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                'A guardar...'
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Despesa
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
