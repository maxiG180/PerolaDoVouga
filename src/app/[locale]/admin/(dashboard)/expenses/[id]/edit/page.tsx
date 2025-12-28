'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

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

export default function EditExpensePage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const supabase = createClient() as any
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [categoryId, setCategoryId] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    const [description, setDescription] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)

    useEffect(() => {
        if (id) {
            fetchExpense()
        }
    }, [id])

    const fetchExpense = async () => {
        try {
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            if (data) {
                setCategoryId(data.category_id)
                setAmount(data.amount.toString())
                setDate(new Date(data.expense_date))
                setDescription(data.description || '')
                setIsRecurring(data.is_recurring || false)
            }
        } catch (err) {
            console.error('Error fetching expense:', err)
            toast.error('Erro ao carregar despesa')
            router.push('/admin/expenses')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            // Validate
            if (!categoryId) {
                setError('Por favor selecione uma categoria')
                setSaving(false)
                return
            }
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                setError('Por favor insira um valor válido')
                setSaving(false)
                return
            }
            if (!date) {
                setError('Por favor selecione uma data')
                setSaving(false)
                return
            }

            // Update expense
            const { error } = await supabase
                .from('expenses')
                .update({
                    category_id: categoryId,
                    amount: Number(amount),
                    expense_date: format(date, 'yyyy-MM-dd'),
                    description: description || null,
                    is_recurring: isRecurring
                })
                .eq('id', id)

            if (error) throw error

            toast.success('Despesa atualizada com sucesso')
            router.push('/admin/expenses')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa')
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        )
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Despesa</h1>
                    <p className="text-sm text-gray-600">Atualize os dados da despesa</p>
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
                                    <SelectValue placeholder="Selecione a categoria">
                                        {categoryId && (() => {
                                            const selected = EXPENSE_CATEGORIES.find(c => c.id === categoryId)
                                            return selected ? (
                                                <span className="flex items-center gap-2">
                                                    <span>{selected.icon}</span>
                                                    <span>{selected.name}</span>
                                                </span>
                                            ) : 'Selecione a categoria'
                                        })()}
                                    </SelectValue>
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
                            <DatePicker
                                value={date}
                                onChange={(newDate) => newDate && setDate(newDate)}
                                label="Selecione a data"
                            />
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
                            className="w-full h-12 text-lg gap-2 bg-primary-900 hover:bg-primary-800 text-white"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    A guardar...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Alterações
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
