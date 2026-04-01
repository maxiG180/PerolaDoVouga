'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from '@/components/ui/popover'
import { Loader2, Save, Copy, ArrowRight, Check, X, MessageSquare, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { parseWhatsAppMenu, ParsedMenuItem } from '@/lib/whatsappParser'
import { Textarea } from '@/components/ui/textarea'

interface MenuItem {
    id: string
    name: string
    price: number
    daily_type: 'soup' | 'dish' | 'none'
    photo_url: string
    category: string
}

export function PlanningWizard() {
    const [date, setDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 1))) // Default tomorrow
    const [soups, setSoups] = useState<MenuItem[]>([])
    const [dishes, setDishes] = useState<MenuItem[]>([])
    const [selectedSoup, setSelectedSoup] = useState<string | null>(null)
    const [selectedDishes, setSelectedDishes] = useState<string[]>([])
    const [notes, setNotes] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false)
    const [importText, setImportText] = useState('')
    const [isImporting, setIsImporting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchItems()
        fetchExistingPlan(date)
    }, [date])

    const fetchItems = async () => {
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .in('daily_type', ['soup', 'dish'])
            .eq('is_available', true)

        if (data) {
            // @ts-ignore
            setSoups(data.filter(i => i.daily_type === 'soup'))
            // @ts-ignore
            setDishes(data.filter(i => i.daily_type === 'dish'))
        }
        setLoading(false)
    }

    const fetchExistingPlan = async (selectedDate: Date) => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd')
        const { data } = await supabase
            .from('daily_menus')
            .select('*')
            .eq('date', formattedDate)
            .single()

        if (data) {
            // @ts-ignore
            setSelectedSoup(data.soup_id)
            // @ts-ignore
            setSelectedDishes(data.dish_ids || [])
            // @ts-ignore
            setNotes(data.notes || '')
        } else {
            setSelectedSoup(null)
            setSelectedDishes([])
            setNotes('')
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')

            // Upsert logic
            const { error } = await supabase
                .from('daily_menus')
                // @ts-ignore
                .upsert({
                    date: formattedDate,
                    soup_id: selectedSoup,
                    dish_ids: selectedDishes,
                    notes: notes
                }, { onConflict: 'date' })

            if (error) throw error

            toast.success('Menu diário guardado com sucesso!')
        } catch (error) {
            console.error('Error saving menu:', error)
            toast.error('Erro ao guardar menu')
        } finally {
            setSaving(false)
        }
    }

    const copyFromYesterday = async () => {
        const yesterday = new Date(date)
        yesterday.setDate(date.getDate() - 1)
        const formattedDate = format(yesterday, 'yyyy-MM-dd')

        const { data } = await supabase
            .from('daily_menus')
            .select('*')
            .eq('date', formattedDate)
            .single()

        if (data) {
            // @ts-ignore
            setSelectedSoup(data.soup_id)
            // @ts-ignore
            setSelectedDishes(data.dish_ids || [])
            toast.success('Menu copiado do dia anterior!')
        } else {
            toast.error('Não existe menu planeado para o dia anterior.')
        }
    }

    const handleDirectImport = async () => {
        if (!importText.trim()) return;
        setIsImporting(true);
        try {
            const parsedItems = parseWhatsAppMenu(importText);
            if (parsedItems.length === 0) {
                toast.error('Não foram encontrados pratos no texto.');
                return;
            }

            const finalSoups: any[] = [];
            const finalDishes: any[] = [];

            // Optimized bulk check/create
            for (const item of parsedItems) {
                const { data: existing } = await (supabase
                    .from('menu_items')
                    .select('*')
                    .ilike('name', item.name)
                    .maybeSingle() as any);

                let menuItem: any;

                if (existing) {
                    menuItem = existing;
                    if (existing.price !== item.price) {
                        const { data: updated } = await (supabase
                            .from('menu_items') as any)
                            .update({ price: item.price, description: item.description || existing.description })
                            .eq('id', existing.id)
                            .select()
                            .single();
                        if (updated) menuItem = updated;
                    }
                } else {
                    const { data: catData } = await (supabase
                        .from('categories')
                        .select('id')
                        .ilike('name', item.category === 'Sopas' ? 'Sopas' : (item.category === 'Peixe' ? 'Peixe' : 'Carne'))
                        .maybeSingle() as any);

                    const { data: newItem, error } = await (supabase
                        .from('menu_items') as any)
                        .insert({
                            name: item.name,
                            price: item.price,
                            description: item.description || null,
                            category_id: catData?.id || null,
                            daily_type: item.category === 'Sopas' ? 'soup' : 'dish',
                            cuisine_type: item.cuisineType,
                            is_available: true,
                            is_always_available: false,
                        })
                        .select()
                        .single();

                    if (error) throw error;
                    menuItem = newItem;
                }

                if (item.category === 'Sopas') {
                    finalSoups.push(menuItem);
                } else {
                    finalDishes.push(menuItem);
                }
            }

            // Update local state
            if (finalSoups.length > 0) {
                setSelectedSoup(finalSoups[0].id);
                const otherSoupIds = finalSoups.slice(1).map(s => s.id);
                setSelectedDishes(prev => Array.from(new Set([...prev, ...otherSoupIds, ...finalDishes.map(d => d.id)])));
            } else {
                setSelectedDishes(prev => Array.from(new Set([...prev, ...finalDishes.map(d => d.id)])));
            }

            // Add to local selection lists
            const allNewItems = [...finalSoups, ...finalDishes];
            allNewItems.forEach(item => {
                if (item.daily_type === 'soup') {
                    if (!soups.find(s => s.id === item.id)) setSoups(prev => [item, ...prev]);
                } else {
                    if (!dishes.find(d => d.id === item.id)) setDishes(prev => [item, ...prev]);
                }
            });

            toast.success(`Importado com sucesso! (${allNewItems.length} itens)`);
            setImportText('');
        } catch (error) {
            console.error('Error importing:', error);
            toast.error('Erro ao processar o texto.');
        } finally {
            setIsImporting(false);
        }
    };

    const toggleDish = (id: string) => {
        if (selectedDishes.includes(id)) {
            setSelectedDishes(selectedDishes.filter(d => d !== id))
        } else {
            setSelectedDishes([...selectedDishes, id])
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-8">
            {/* Header / Date Selection */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="w-full md:w-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">Planeamento para:</h2>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full md:w-[240px] justify-start text-left font-normal mt-1 text-lg">
                                {format(date, "EEEE, d 'de' MMMM", { locale: pt })}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <div className="relative">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => d && setDate(d)}
                                    initialFocus
                                />
                                <PopoverClose className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100">
                                    <X className="w-4 h-4 text-gray-500" />
                                </PopoverClose>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={copyFromYesterday} className="w-full sm:w-auto px-6">
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar de Ontem
                    </Button>
                    <Button
                        className="bg-gold hover:bg-gold-dark text-white w-full sm:w-auto px-8 shadow-lg shadow-gold/20"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Guardar Planeamento
                    </Button>
                </div>
            </div>

            {/* Quick Import Section */}
            <Card className="border-gold/30 bg-gold/5 shadow-sm overflow-hidden">
                <CardHeader className="bg-white/50 border-b border-gold/10 py-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-gold-dark">
                        <Wand2 className="w-4 h-4" />
                        Importação Rápida (Cole o Menu aqui)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <Textarea 
                        placeholder="Cole aqui o texto do WhatsApp ou qualquer lista com preços (Ex: Bacalhau - 12,50€)"
                        className="min-h-[120px] bg-white border-gold/20 focus:border-gold transition-colors text-sm"
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                    />
                    <Button 
                        onClick={handleDirectImport} 
                        disabled={isImporting || !importText.trim()}
                        className="w-full bg-gold hover:bg-gold-dark text-white font-bold"
                    >
                        {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Processar e Identificar Pratos
                    </Button>
                </CardContent>
            </Card>

            {/* Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Step 1: Soup */}
                <Card className="border-gray-200 shadow-sm transition-all hover:border-gold/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">1</span>
                            Sopa do Dia
                        </CardTitle>
                        {selectedSoup && <Check className="text-green-500 w-6 h-6" />}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {soups.map(soup => (
                                <div
                                    key={soup.id}
                                    onClick={() => setSelectedSoup(soup.id)}
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md",
                                        selectedSoup === soup.id
                                            ? "border-[#D4AF37] bg-yellow-50"
                                            : "border-transparent bg-gray-50 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="relative h-24 w-full mb-2 rounded-md overflow-hidden">
                                        {soup.photo_url ? (
                                            <Image src={soup.photo_url} alt={soup.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>
                                    <p className="font-medium text-sm text-center line-clamp-2">{soup.name}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Step 2: Dishes */}
                <Card className="border-gray-200 shadow-sm transition-all hover:border-gold/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">2</span>
                            Pratos do Dia
                        </CardTitle>
                        {selectedDishes.length > 0 && <Badge className="bg-green-500">{selectedDishes.length} selecionados</Badge>}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                            {dishes.map(dish => (
                                <div
                                    key={dish.id}
                                    onClick={() => toggleDish(dish.id)}
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md relative",
                                        selectedDishes.includes(dish.id)
                                            ? "border-[#D4AF37] bg-yellow-50"
                                            : "border-transparent bg-gray-50 hover:bg-gray-100"
                                    )}
                                >
                                    {selectedDishes.includes(dish.id) && (
                                        <div className="absolute top-2 right-2 bg-[#D4AF37] text-white rounded-full p-1 z-10">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                    <div className="relative h-24 w-full mb-2 rounded-md overflow-hidden">
                                        {dish.photo_url ? (
                                            <Image src={dish.photo_url} alt={dish.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>
                                    <p className="font-medium text-sm text-center line-clamp-2">{dish.name}</p>
                                    <p className="text-xs text-gray-500 text-center">{dish.category}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Step 3: Shopping List / Notes */}
            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">3</span>
                        Lista de Compras & Notas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="w-full min-h-[150px] p-4 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-y"
                        placeholder="Escreva aqui a lista de compras para este dia ou outras notas importantes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </CardContent>
            </Card>

        </div >
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium text-white", className)}>
            {children}
        </span>
    )
}
