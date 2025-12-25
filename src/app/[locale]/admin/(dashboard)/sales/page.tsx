'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Minus, Save, ArrowLeft } from 'lucide-react'
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

    // Fetch sales for selected date
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

            // Refresh list
            fetchTodaySales()

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao registar venda')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registar Vendas</h1>
                    <p className="text-sm text-gray-600">{format(date, "EEEE, d 'de' MMMM", { locale: pt })}</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {format(date, "dd/MM/yyyy")}
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

            {/* Quick Add Form */}
            <div className="bg-white border border-gray-300 rounded-lg p-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                        <Label className="text-sm font-medium text-gray-700">Prato</Label>
                        <Select value={selectedItem} onValueChange={setSelectedItem}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {menuItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name} - €{item.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-3">
                        <Label className="text-sm font-medium text-gray-700">Quantidade</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="h-10 text-center font-bold"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Total</Label>
                        <div className="mt-1 h-10 px-3 flex items-center justify-end bg-green-50 border border-green-300 rounded-lg">
                            <span className="font-bold text-green-700">
                                €{selectedMenuItem ? (selectedMenuItem.price * quantity).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <Button
                            type="submit"
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={loading || !selectedItem}
                        >
                            <Save className="w-4 h-4" />
                            Registar
                        </Button>
                    </div>
                </form>
                {error && (
                    <div className="text-red-700 text-sm bg-red-50 p-2 rounded-md mt-2">
                        {error}
                    </div>
                )}
            </div>

            {/* Excel-Style Table */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-100 border-b border-gray-300">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">
                            Hora
                        </div>
                        <div className="col-span-5 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300">
                            Prato
                        </div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-center">
                            Qtd.
                        </div>
                        <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-700 border-r border-gray-300 text-right">
                            Preço Unit.
                        </div>
                        <div className="col-span-1 px-4 py-3 font-bold text-sm text-gray-700 text-right">
                            Total
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div>
                    {todaySales.length > 0 ? (
                        todaySales.map((sale, index) => (
                            <div
                                key={sale.id}
                                className={`grid grid-cols-12 gap-0 border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                                    }`}
                            >
                                <div className="col-span-2 px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                                    {format(new Date(sale.created_at || sale.sale_date), "HH:mm")}
                                </div>
                                <div className="col-span-5 px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                    {sale.item_name}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm text-gray-900 border-r border-gray-200 text-center font-bold">
                                    {sale.quantity}
                                </div>
                                <div className="col-span-2 px-4 py-3 text-sm text-gray-700 border-r border-gray-200 text-right">
                                    €{Number(sale.unit_price).toFixed(2)}
                                </div>
                                <div className="col-span-1 px-4 py-3 text-sm font-bold text-green-600 text-right">
                                    €{Number(sale.total_price).toFixed(2)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 text-center text-gray-500">
                            <p className="font-medium">Sem vendas registadas para esta data</p>
                            <p className="text-sm mt-1">Use o formulário acima para registar vendas</p>
                        </div>
                    )}
                </div>

                {/* Table Footer - Totals */}
                {todaySales.length > 0 && (
                    <div className="bg-gray-100 border-t-2 border-gray-400">
                        <div className="grid grid-cols-12 gap-0">
                            <div className="col-span-7 px-4 py-3 font-bold text-sm text-gray-900 border-r border-gray-300">
                                TOTAL
                            </div>
                            <div className="col-span-2 px-4 py-3 font-bold text-sm text-gray-900 border-r border-gray-300 text-center">
                                {stats.totalItems}
                            </div>
                            <div className="col-span-3 px-4 py-3 font-bold text-base text-green-700 text-right">
                                €{stats.totalRevenue.toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics */}
            {todaySales.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                            <span>Total de vendas:</span>
                            <span className="font-medium text-gray-900">{todaySales.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total de itens vendidos:</span>
                            <span className="font-medium text-gray-900">{stats.totalItems}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="font-bold text-gray-900">Receita total:</span>
                            <span className="font-bold text-green-600">€{stats.totalRevenue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
