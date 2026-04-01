'use client'

import { useState } from 'react'
import { MenuItem } from './MenuItem'
import { useCartStore } from '@/stores/cart-store'
import { toast } from 'sonner'
import {
    Clock,
    Calendar,
    Soup,
    Utensils,
    Search,
    Coffee,
    Fish,
    Cake,
    Beer,
    Wine,
    Sandwich,
    Pizza,
    IceCream,
    Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MenuContentProps {
    menuData: {
        alwaysAvailable: any[]
        todaysSoup: any
        todaysSoups?: any[]
        todaysPratos: any[]
        advanceOrderItems: any[]
    }
    phone: string
}

const CATEGORY_ICONS: Record<string, any> = {
    'Sopa': Soup,
    'Sopas': Soup,
    'Carne': Utensils,
    'Peixe': Fish,
    'Vegetariano': Pizza, // Placeholder
    'Sobremesa': Cake,
    'Sobremesas': Cake,
    'Bebidas': Coffee,
    'Cafetaria': Coffee,
    'Vinhos': Wine,
    'Cervejas': Beer,
    'Snacks': Sandwich,
    'Sandes': Sandwich,
    'Sugestões de Carne': Utensils,
    'Gelados': IceCream,
    'Outros': Utensils
}

const CATEGORY_ORDER = ['Sopas', 'Peixe', 'Carne', 'Sugestões de Carne']
const getCategoryPriority = (name: string) => {
    const idx = CATEGORY_ORDER.indexOf(name)
    return idx === -1 ? 999 : idx
}

export function MenuContent({ menuData, phone }: MenuContentProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

    // Extract all unique categories
    const allCategories = new Set<string>(['Todos'])
    const hasSoups = menuData.todaysSoups && menuData.todaysSoups.length > 0;
    if (hasSoups || menuData.todaysSoup) allCategories.add('Sopa do Dia')
    if (menuData.todaysPratos.length > 0) allCategories.add('Pratos do Dia')
    if (menuData.advanceOrderItems.length > 0) allCategories.add('Sob Encomenda')
    allCategories.add('Outros')

    const categoriesList = Array.from(allCategories)

    const filterItems = (items: any[]) => {
        if (!searchQuery) return items
        return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }

    const filteredAlwaysAvailable = filterItems(menuData.alwaysAvailable)
    const filteredTodaysPratos = filterItems(menuData.todaysPratos)
    const filteredAdvanceOrder = filterItems(menuData.advanceOrderItems)

    // Group always available items by category
    const groupedAlwaysAvailable = filteredAlwaysAvailable.reduce((acc, item) => {
        const categoryName = item.categories?.name || 'Outros'
        if (!acc[categoryName]) {
            acc[categoryName] = []
        }
        acc[categoryName].push(item)
        return acc
    }, {} as Record<string, any[]>)

    // Group today's pratos by category
    const groupedTodaysPratos = filteredTodaysPratos.reduce((acc, item) => {
        const categoryName = item.categories?.name || 'Outros'
        if (!acc[categoryName]) {
            acc[categoryName] = []
        }
        acc[categoryName].push(item)
        return acc
    }, {} as Record<string, any[]>)

    const today = new Date().toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const shouldShowSection = (sectionName: string, categoryName?: string) => {
        if (selectedCategory === 'Todos') return true
        if (sectionName === 'Sopa do Dia' && selectedCategory === 'Sopa do Dia') return true
        if (sectionName === 'Pratos do Dia' && selectedCategory === 'Pratos do Dia') return true
        if (sectionName === 'Sob Encomenda' && selectedCategory === 'Sob Encomenda') return true
        if (sectionName === 'Outros' && selectedCategory === 'Outros') return true
        if (categoryName && selectedCategory === categoryName) return true
        return false
    }

    const isDrinkCategory = (category: string) =>
        ['Cafetaria', 'Bebidas', 'Vinhos', 'Cervejas', 'Refrigerantes', 'Águas'].includes(category)

    return (
        <div className="space-y-0">
            {/* Search and Category Filter */}
            <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl py-6 -mx-4 px-4 md:mx-0 md:px-0 space-y-6 transition-all border-b border-stone-100">
                <div className="flex justify-center">
                    <div className="relative w-full max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-gold transition-colors" />
                        <Input
                            placeholder="Procura o seu sabor favorito..."
                            className="pl-12 h-12 bg-stone-50/50 border-stone-200 focus:border-gold focus:ring-gold/20 shadow-sm rounded-2xl text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2 max-w-5xl mx-auto justify-start md:justify-center">
                    {categoriesList.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat] || (cat.includes('Sopa') ? Soup : (cat.includes('Pratos') ? Utensils : (cat.includes('Encomenda') ? Calendar : Utensils)))
                        const isSelected = selectedCategory === cat

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "flex flex-col items-center gap-2 group min-w-[80px] transition-all duration-300",
                                    isSelected ? "scale-110" : "opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                    isSelected 
                                        ? "bg-stone-900 text-white shadow-gold/20 shadow-lg" 
                                        : "bg-white border border-stone-200 text-stone-400 group-hover:border-gold/50"
                                )}>
                                    <Icon className={cn("w-4 h-4 md:w-5 md:h-5", isSelected ? "text-gold" : "group-hover:text-gold/70")} />
                                </div>
                                <span className={cn(
                                    "text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors",
                                    isSelected ? "text-stone-900" : "text-stone-400"
                                )}>
                                    {cat}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-16 pb-20 relative">
                {/* Subtle background element */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                {/* Daily Menu Not Updated Alert */}
                {menuData.todaysPratos.length === 0 && !(menuData.todaysSoups && menuData.todaysSoups.length > 0) && !menuData.todaysSoup && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-xl shadow-stone-200/50 text-center space-y-6 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-gold" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
                                    Menu do dia ainda não atualizado
                                </h3>
                                <p className="text-stone-500 text-lg max-w-md mx-auto">
                                    Pedimos desculpa, mas o chef ainda está a preparar as sugestões de hoje. Volte mais tarde ou contacte-nos diretamente.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <Button 
                                    asChild
                                    size="lg" 
                                    className="bg-stone-800 hover:bg-stone-900 text-gold rounded-full px-8 h-12 shadow-lg transition-all"
                                >
                                    <a href={`tel:${phone}`} className="flex items-center gap-2">
                                        <Phone className="w-5 h-5" />
                                        Contactar Restaurante
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 h-12 border-stone-200 text-stone-600 hover:bg-stone-50"
                                    onClick={() => window.location.reload()}
                                >
                                    Tentar Novamente
                                </Button>
                            </div>

                            <p className="text-stone-400 text-sm italic pt-2">
                                {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Today's Soup */}
                {(menuData.todaysSoups || [menuData.todaysSoup]).filter(Boolean).length > 0 && shouldShowSection('Sopa do Dia') && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center gap-2 text-center mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-2">
                                <Soup className="w-6 h-6 text-gold" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Sopa do Dia</h2>
                            <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-gold/30"></div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-dark">{today}</span>
                                <div className="h-px w-8 bg-gold/30"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                            {(menuData.todaysSoups || [menuData.todaysSoup]).filter(Boolean).map((soup: any) => (
                                <MenuItem key={soup.id} item={soup} hideImage={false} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Today's Pratos */}
                {Object.keys(groupedTodaysPratos).length > 0 && shouldShowSection('Pratos do Dia') && (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-2">
                                <Clock className="w-6 h-6 text-gold" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Pratos de Hoje</h2>
                            <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-gold/30"></div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-dark">Sugestões do Chefe</span>
                                <div className="h-px w-8 bg-gold/30"></div>
                            </div>
                        </div>

                        {Object.entries(groupedTodaysPratos)
                            .sort(([a], [b]) => getCategoryPriority(a) - getCategoryPriority(b))
                            .map(([categoryName, items]) => (
                                <div key={categoryName} className="space-y-6 pt-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-bold text-gold-dark uppercase tracking-[0.2em]">
                                            {categoryName}
                                        </h3>
                                        <div className="flex-1 h-px bg-gold/10"></div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                                        {(items as any[]).map((item: any) => (
                                            <MenuItem
                                                key={item.id}
                                                item={item}
                                                hideImage={isDrinkCategory(categoryName)}
                                                quantityRemaining={item.quantity_remaining}
                                                isSoldOut={item.is_sold_out}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </section>
                )}

                {/* Advance Order Items */}
                {menuData.advanceOrderItems.length > 0 && shouldShowSection('Sob Encomenda') && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-2">
                                <Calendar className="w-6 h-6 text-gold" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Sob Encomenda</h2>
                            <p className="text-stone-500 text-sm max-w-sm mx-auto">
                                Estes pratos requerem encomenda prévia (2+ dias). Perfeitos para grupos ou ocasiões especiais.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                            {filteredAdvanceOrder.map((item: any) => (
                                <MenuItem key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Request Section */}
                {shouldShowSection('Outros') && (
                    <section className="max-w-3xl mx-auto pt-8 scroll-mt-24" id="custom-order">
                        <div className="bg-white border-2 border-dashed border-gold/30 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-sm hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-gold/5 rounded-2xl flex items-center justify-center mx-auto">
                                <Calendar className="w-8 h-8 text-gold" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-bold text-stone-800">Encomenda para outro dia</h3>
                                <p className="text-stone-500 max-w-md mx-auto">
                                    Quer encomendar algo específico para amanhã ou outro dia? Basta escrever aqui o seu pedido.
                                </p>
                            </div>
                            
                            <div className="max-w-md mx-auto space-y-4">
                                <textarea 
                                    className="w-full rounded-2xl border-stone-200 focus:border-gold focus:ring-gold/20 min-h-[100px] p-4 text-sm"
                                    placeholder="Ex: Gostava de encomendar 2 doses de Bacalhau à Brás para amanhã às 13:00..."
                                    id="custom-request-text"
                                ></textarea>
                                <Button 
                                    variant="gold" 
                                    className="w-full rounded-full h-12 text-base font-bold shadow-lg shadow-gold/20"
                                    onClick={() => {
                                        const text = (document.getElementById('custom-request-text') as HTMLTextAreaElement).value;
                                        if (!text.trim()) return;
                                        
                                        useCartStore.getState().addItem({
                                            menuItemId: 'custom-request',
                                            name: `Pedido Especial: ${text}`,
                                            price: 0,
                                            quantity: 1
                                        });

                                        toast.success('Pedido especial adicionado ao carrinho!');
                                        (document.getElementById('custom-request-text') as HTMLTextAreaElement).value = '';
                                    }}
                                >
                                    Adicionar ao Pedido
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {/* In-Person Only Notice */}
                <div className="max-w-3xl mx-auto pt-8">
                    <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center space-y-4">
                        <div className="flex justify-center gap-4 text-stone-400">
                            <Coffee className="w-6 h-6" />
                            <Sandwich className="w-6 h-6" />
                            <Cake className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-stone-800 tracking-tight">Snacks, Sobremesas e Bebidas</h4>
                            <p className="text-stone-500 text-sm">
                                Disponíveis apenas para consumo ou pedido presencialmente no restaurante.
                            </p>
                        </div>
                    </div>
                </div>

                {/* No Results */}
                {filteredAlwaysAvailable.length === 0 &&
                    filteredTodaysPratos.length === 0 &&
                    !menuData.todaysSoup &&
                    filteredAdvanceOrder.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Nenhum item encontrado.</p>
                        </div>
                    )}
            </div>
        </div>
    )
}
