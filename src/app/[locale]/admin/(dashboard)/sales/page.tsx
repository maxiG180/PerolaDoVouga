'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Minus, ShoppingCart, Save, ArrowLeft, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SalesPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [menuItems, setMenuItems] = useState<any[]>([])

    // Form state
    const [selectedItem, setSelectedItem] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [date, setDate] = useState<Date>(new Date())

    // List state
    const [todaySales, setTodaySales] = useState<any[]>([])
    const [stats, setStats] = useState({ totalRevenue: 0, totalItems: 0 })

    const selectedMenuItem = menuItems.find(item => item.id === selectedItem)

    // Fetch menu items
    useEffect(() => {
        async function fetchMenu() {
            try {
                const res = await fetch('/api/menu/items')
                if (res.ok) {
                    const data = await res.json()
                    setMenuItems(data)
                }
            } catch (err) {
                console.error('Error fetching menu:', err)
            }
        }
        fetchMenu()
    }, [])

    // Fetch today's sales
    const fetchTodaySales = async () => {
        try {
            const todayStr = format(date, 'yyyy-MM-dd')
            const res = await fetch(`/api/sales?start_date=${todayStr}&end_date=${todayStr}`)
            if (res.ok) {
                const data = await res.json()
                setTodaySales(data)

                // Calculate stats
                const totalRev = data.reduce((sum: number, item: any) => sum + Number(item.total_price), 0)
                const totalQty = data.reduce((sum: number, item: any) => sum + item.quantity, 0)
                setStats({ totalRevenue: totalRev, totalItems: totalQty })
            }
        } catch (err) {
            console.error('Error fetching sales:', err)
        }
    }

    // Refresh list when date changes
    useEffect(() => {
        fetchTodaySales()
    }, [date])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!selectedItem) {
                setError('Por favor selecione um prato')
                setLoading(false)
                return
            }
            if (quantity <= 0) {
                setError('Quantidade tem que ser maior que zero')
                setLoading(false)
                return
            }

            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menu_item_id: selectedItem,
                    item_name: selectedMenuItem?.name,
                    quantity,
                    unit_price: selectedMenuItem?.price,
                    sale_date: format(date, 'yyyy-MM-dd')
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao registar venda')
            }

            // Reset form
            setSelectedItem('')
            setQuantity(1)
            // Keep date

            // Refresh list
            fetchTodaySales()

            // Optional: Show simple feedback or just rely on list update
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao registar venda')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-20 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/admin">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary-900 flex items-center gap-2">
                        <ShoppingCart className="w-8 h-8" />
                        Registar Venda
                    </h1>
                    <p className="text-sm text-muted-foreground">{format(date, "EEEE, d 'de' MMMM", { locale: pt })}</p>
                </div>
            </div>

            {/* Form */}
            <Card className="shadow-lg border-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Nova Venda</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Selection */}
                        <div className="flex justify-end mb-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            "w-[180px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "dd/MM/yyyy") : <span>Data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
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

                        {/* Dish Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="dish" className="text-base font-medium">
                                Prato *
                            </Label>
                            <Select value={selectedItem} onValueChange={setSelectedItem}>
                                <SelectTrigger className="h-12 text-lg">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {menuItems.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            <span className="flex items-center justify-between w-full gap-4">
                                                <span>{item.name}</span>
                                                <span className="text-sm text-muted-foreground">€{item.price}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Quantidade *</Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14 rounded-full border-2"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-6 h-6" />
                                </Button>
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="h-14 text-center text-3xl font-bold flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14 rounded-full border-2"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Price Preview */}
                        {selectedMenuItem && (
                            <div className="flex justify-between items-center text-lg px-2 py-2 bg-green-50 rounded-lg">
                                <span className="font-medium">Total a Registar:</span>
                                <span className="font-bold text-green-700 text-xl">
                                    €{(selectedMenuItem.price * quantity).toFixed(2)}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-700 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-xl font-bold gap-2 bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95 transition-transform"
                            disabled={loading || !selectedItem}
                        >
                            {loading ? (
                                'A guardar...'
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    Registar Venda
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List of Recent Sales */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-primary-900">Vendas do Dia</h2>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">{stats.totalItems} itens</div>
                        <div className="text-lg font-bold text-green-600">Total: €{stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {todaySales.length > 0 ? (
                        todaySales.map((sale) => (
                            <div key={sale.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-lg">{sale.item_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {sale.quantity}x €{sale.unit_price}
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-primary-900">
                                    €{Number(sale.total_price).toFixed(2)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                            Sem vendas registadas para esta data
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
