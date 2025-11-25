'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, addDays, startOfDay } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Search, Calendar as CalendarIcon, Soup, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyMenuPlannerProps {
    initialItems: any[] // All menu items to choose from
}

export function DailyMenuPlanner({ initialItems }: DailyMenuPlannerProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))
    const [planningId, setPlanningId] = useState<string | null>(null)
    const [selectedSoupId, setSelectedSoupId] = useState<string>('none')
    const [dailyDishes, setDailyDishes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingSoup, setIsSavingSoup] = useState(false)

    // Search state
    const [dishSearch, setDishSearch] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const supabase = createClient() as any

    // Filter items
    const soupOptions = initialItems.filter(item => item.daily_type === 'soup')
    const dishOptions = initialItems.filter(item =>
        item.daily_type === 'dish' &&
        item.name.toLowerCase().includes(dishSearch.toLowerCase())
    )

    const dates = [
        { label: 'Hoje', date: startOfDay(new Date()) },
        { label: 'Amanhã', date: startOfDay(addDays(new Date(), 1)) },
        { label: 'Depois de Amanhã', date: startOfDay(addDays(new Date(), 2)) }
    ]

    useEffect(() => {
        fetchPlanning()
    }, [selectedDate])

    const fetchPlanning = async () => {
        setIsLoading(true)
        try {
            // Get planning for date
            const { data: planning, error } = await supabase
                .from('daily_menu_planning')
                .select(`
                    id,
                    soup_id,
                    daily_menu_items (
                        id,
                        menu_item_id,
                        is_sold_out,
                        menu_items (
                            id,
                            name,
                            price,
                            image_url
                        )
                    )
                `)
                .eq('date', format(selectedDate, 'yyyy-MM-dd'))
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (planning) {
                setPlanningId(planning.id)
                setSelectedSoupId(planning.soup_id || 'none')
                setDailyDishes(planning.daily_menu_items || [])
            } else {
                setPlanningId(null)
                setSelectedSoupId('none')
                setDailyDishes([])
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao carregar planeamento')
        } finally {
            setIsLoading(false)
        }
    }

    const ensurePlanningExists = async () => {
        if (planningId) return planningId

        const { data, error } = await supabase
            .from('daily_menu_planning')
            .insert({
                date: format(selectedDate, 'yyyy-MM-dd')
            })
            .select()
            .single()

        if (error) throw error
        setPlanningId(data.id)
        return data.id
    }

    const handleSoupChange = async (soupId: string) => {
        setIsSavingSoup(true)
        try {
            const pid = await ensurePlanningExists()

            const { error } = await supabase
                .from('daily_menu_planning')
                .update({ soup_id: soupId === 'none' ? null : soupId })
                .eq('id', pid)

            if (error) throw error

            setSelectedSoupId(soupId)
            toast.success('Sopa do dia atualizada')
        } catch (error) {
            toast.error('Erro ao atualizar sopa')
        } finally {
            setIsSavingSoup(false)
        }
    }

    const handleAddDish = async (dishId: string) => {
        try {
            const pid = await ensurePlanningExists()

            const { error } = await supabase
                .from('daily_menu_items')
                .insert({
                    planning_id: pid,
                    menu_item_id: dishId
                })

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.error('Este prato já está no menu')
                    return
                }
                throw error
            }

            toast.success('Prato adicionado')
            setDishSearch('')
            setIsSearchOpen(false)
            fetchPlanning() // Refresh list
        } catch (error) {
            toast.error('Erro ao adicionar prato')
        }
    }

    const handleRemoveDish = async (itemId: string) => {
        try {
            const { error } = await supabase
                .from('daily_menu_items')
                .delete()
                .eq('id', itemId)

            if (error) throw error

            setDailyDishes(dailyDishes.filter(d => d.id !== itemId))
            toast.success('Prato removido')
        } catch (error) {
            toast.error('Erro ao remover prato')
        }
    }

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-gold" />
                <h2 className="text-xl font-serif font-bold text-primary-900">Planeamento Diário</h2>
            </div>

            {/* Date Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide md:mx-0 md:px-0 md:pb-0">
                {dates.map((d) => (
                    <button
                        key={d.label}
                        onClick={() => setSelectedDate(d.date)}
                        className={cn(
                            "flex-shrink-0 px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-all border border-transparent",
                            selectedDate.getTime() === d.date.getTime()
                                ? "bg-primary-900 text-white shadow-md border-primary-900"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                        )}
                    >
                        {d.label}
                        <span className={cn(
                            "block text-xs font-normal mt-0.5",
                            selectedDate.getTime() === d.date.getTime() ? "text-white/80" : "text-gray-400"
                        )}>
                            {format(d.date, 'dd MMM', { locale: pt })}
                        </span>
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Soup Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gold/10 rounded-full">
                                <Soup className="w-5 h-5 text-gold" />
                            </div>
                            <Label className="text-base font-semibold">Sopa do Dia</Label>
                        </div>
                        <Select
                            value={selectedSoupId}
                            onValueChange={handleSoupChange}
                            disabled={isSavingSoup}
                        >
                            <SelectTrigger className="w-full h-12 text-base">
                                <SelectValue placeholder="Selecione a sopa..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhuma</SelectItem>
                                {soupOptions.map(soup => (
                                    <SelectItem key={soup.id} value={soup.id} className="py-3">
                                        {soup.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dishes Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gold/10 rounded-full">
                                    <Utensils className="w-5 h-5 text-gold" />
                                </div>
                                <Label className="text-base font-semibold">Pratos do Dia</Label>
                            </div>
                        </div>

                        {/* Search & Add */}
                        <div className="relative w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Pesquisar prato..."
                                    className="pl-10 h-12 text-base w-full"
                                    value={dishSearch}
                                    onChange={(e) => {
                                        setDishSearch(e.target.value)
                                        setIsSearchOpen(true)
                                    }}
                                    onFocus={() => setIsSearchOpen(true)}
                                />
                            </div>

                            {isSearchOpen && dishSearch && (
                                <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 max-h-[60vh] overflow-y-auto">
                                    {dishOptions.length === 0 ? (
                                        <div className="p-4 text-sm text-gray-500 text-center">
                                            Nenhum prato encontrado.
                                        </div>
                                    ) : (
                                        dishOptions.map(dish => (
                                            <button
                                                key={dish.id}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between group border-b border-gray-50 last:border-0"
                                                onClick={() => handleAddDish(dish.id)}
                                            >
                                                <span className="font-medium text-gray-900">{dish.name}</span>
                                                <div className="bg-gold/10 p-1.5 rounded-full">
                                                    <Plus className="w-4 h-4 text-gold" />
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                            {isSearchOpen && (
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsSearchOpen(false)}
                                />
                            )}
                        </div>

                        {/* List of Added Dishes */}
                        <div className="grid gap-3">
                            {dailyDishes.length === 0 ? (
                                <div className="text-sm text-gray-500 italic border border-dashed border-gray-200 rounded-lg p-4 text-center">
                                    Nenhum prato selecionado para este dia.
                                </div>
                            ) : (
                                dailyDishes.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.menu_items.image_url && (
                                                <img
                                                    src={item.menu_items.image_url}
                                                    alt={item.menu_items.name}
                                                    className="w-10 h-10 rounded-md object-cover"
                                                />
                                            )}
                                            <span className="font-medium text-gray-900">{item.menu_items.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleRemoveDish(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
