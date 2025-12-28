'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, TrendingUp, Calculator } from 'lucide-react'
import Link from 'next/link'

// Using strict relative path imports to avoid any alias issues
// import { useToast } from "@/components/ui/use-toast" - if available

export default function EditMarginPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Data state
    const [itemName, setItemName] = useState('')
    const [cost, setCost] = useState('')
    const [price, setPrice] = useState('')

    // Derived state
    const numCost = Number(cost) || 0
    const numPrice = Number(price) || 0
    const margin = numPrice > 0 ? ((numPrice - numCost) / numPrice) * 100 : 0

    const marginStatus = margin >= 70 ? 'excellent' : margin >= 50 ? 'good' : margin >= 30 ? 'warning' : 'critical'
    const marginColor =
        marginStatus === 'excellent' ? 'text-emerald-600' :
            marginStatus === 'good' ? 'text-green-600' :
                marginStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'

    useEffect(() => {
        async function fetchData() {
            if (!id) return

            try {
                // We'll fetch from our margins API which returns all, but we filter for one
                // Or implementing a single fetch endpoint would be better, but for now filtering is okay for prototype
                const res = await fetch('/api/margins')
                if (res.ok) {
                    const data = await res.json()
                    const item = data.find((i: any) => i.id === id)
                    if (item) {
                        setItemName(item.name)
                        setCost(item.ingredient_cost.toString())
                        setPrice(item.selling_price.toString())
                    } else {
                        setError('Prato não encontrado')
                    }
                }
            } catch (err) {
                setError('Erro ao carregar dados')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        try {
            // Validation
            const numCostValue = Number(cost)
            const numPriceValue = Number(price)

            if (isNaN(numCostValue) || numCostValue < 0) {
                setError('Custo inválido. Insira um valor positivo.')
                setSaving(false)
                return
            }

            if (isNaN(numPriceValue) || numPriceValue <= 0) {
                setError('Preço inválido. Insira um valor positivo.')
                setSaving(false)
                return
            }

            if (numPriceValue <= numCostValue) {
                const confirmLoss = confirm(
                    '⚠️ AVISO: O preço de venda é menor ou igual ao custo!\n\n' +
                    `Custo: €${numCostValue.toFixed(2)}\n` +
                    `Preço: €${numPriceValue.toFixed(2)}\n` +
                    `Margem: ${margin.toFixed(1)}%\n\n` +
                    'Isto significa que está a PERDER DINHEIRO neste prato.\n\n' +
                    'Deseja continuar mesmo assim?'
                )
                if (!confirmLoss) {
                    setSaving(false)
                    return
                }
            } else if (margin < 30) {
                const confirmLowMargin = confirm(
                    `⚠️ AVISO: Margem muito baixa (${margin.toFixed(1)}%)\n\n` +
                    'Margens abaixo de 30% podem não cobrir custos operacionais.\n' +
                    'Recomenda-se margem mínima de 50%.\n\n' +
                    'Deseja continuar?'
                )
                if (!confirmLowMargin) {
                    setSaving(false)
                    return
                }
            }

            const response = await fetch('/api/margins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menu_item_id: id,
                    ingredient_cost: Number(cost),
                    selling_price: Number(price)
                })
            })

            if (!response.ok) throw new Error('Erro ao guardar')

            router.push('/admin/margins')
            router.refresh()
        } catch (err) {
            setError('Erro ao guardar alterações')
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center">A carregar...</div>

    return (
        <div className="space-y-6 pb-20 max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/admin/margins">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary-900">Editar Margem</h1>
                    <p className="text-sm text-muted-foreground">{itemName}</p>
                </div>
            </div>

            <Card className="shadow-lg border-none">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Simulation Card */}
                        <div className={`p-4 rounded-lg bg-gray-50 border-2 ${marginStatus === 'excellent' ? 'border-emerald-100 bg-emerald-50' :
                            marginStatus === 'good' ? 'border-green-100 bg-green-50' :
                                marginStatus === 'warning' ? 'border-yellow-100 bg-yellow-50' : 'border-red-100 bg-red-50'
                            }`}>
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                                <Calculator className="w-4 h-4" />
                                Simulação de Margem
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className={`text-4xl font-bold ${marginColor}`}>
                                    {margin.toFixed(1)}%
                                </span>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Lucro: €{(numPrice - numCost).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Cost Input */}
                        <div className="space-y-2">
                            <Label htmlFor="cost" className="text-base font-medium">
                                Custo dos Ingredientes (€)
                            </Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                min="0"
                                max="10000"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="h-12 text-lg"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Custo total para produzir uma dose deste prato.
                            </p>
                        </div>

                        {/* Price Input */}
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-base font-medium">
                                Preço de Venda (€)
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                max="10000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="h-12 text-lg"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                ⚠️ Atualizar este valor vai mudar o preço no menu público.
                            </p>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg gap-2 bg-primary-900 hover:bg-primary-800"
                            disabled={saving}
                        >
                            {saving ? 'A guardar...' : (
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
