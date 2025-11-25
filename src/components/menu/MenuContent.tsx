'use client'

import { useState } from 'react'
import { MenuItem } from './MenuItem'
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
    IceCream
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MenuContentProps {
    menuData: {
        alwaysAvailable: any[]
        todaysSoup: any
        todaysPratos: any[]
        advanceOrderItems: any[]
    }
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
    'Gelados': IceCream,
    'Outros': Utensils
}

export function MenuContent({ menuData }: MenuContentProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

    // Extract all unique categories
    const allCategories = new Set<string>(['Todos'])
    if (menuData.todaysSoup) allCategories.add('Sopa do Dia')
    if (menuData.todaysPratos.length > 0) allCategories.add('Pratos do Dia')

    menuData.alwaysAvailable.forEach(item => {
        if (item.categories?.name) allCategories.add(item.categories.name)
    })

    if (menuData.advanceOrderItems.length > 0) allCategories.add('Sob Encomenda')

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
        if (categoryName && selectedCategory === categoryName) return true
        return false
    }

    const isDrinkCategory = (category: string) =>
        ['Cafetaria', 'Bebidas', 'Vinhos', 'Cervejas', 'Refrigerantes', 'Águas'].includes(category)

    return (
        <div className="space-y-8">
            {/* Search and Category Filter */}
            <div className="sticky top-[72px] z-30 bg-beige-100/95 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 space-y-4 shadow-sm transition-all">
                <div className="flex justify-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Pesquisar pratos..."
                            className="pl-10 bg-white border-beige-200 focus:border-gold shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                    {categoriesList.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat] || (cat.includes('Sopa') ? Soup : (cat.includes('Pratos') ? Utensils : (cat.includes('Encomenda') ? Calendar : Utensils)))
                        const isSelected = selectedCategory === cat

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium",
                                    isSelected
                                        ? "bg-stone-900 text-white shadow-lg scale-105"
                                        : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isSelected ? "text-gold" : "text-stone-400")} />
                                <span className="text-sm">{cat}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-12 pb-20">
                {/* Today's Soup */}
                {menuData.todaysSoup && shouldShowSection('Sopa do Dia') && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Soup className="w-6 h-6 text-gold" />
                                <h2 className="text-2xl font-serif font-bold text-beige-900">Sopa do Dia</h2>
                            </div>
                            <Badge className="bg-gold/10 text-gold hover:bg-gold/20 border-0">
                                {today}
                            </Badge>
                        </div>
                        <div className="max-w-md">
                            <MenuItem item={menuData.todaysSoup} hideImage={false} />
                        </div>
                    </section>
                )}

                {/* Today's Pratos */}
                {Object.keys(groupedTodaysPratos).length > 0 && shouldShowSection('Pratos do Dia') && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 text-gold" />
                                <h2 className="text-2xl font-serif font-bold text-beige-900">Hoje Disponível</h2>
                            </div>
                            <Badge className="bg-gold/10 text-gold hover:bg-gold/20 border-0">
                                {today}
                            </Badge>
                        </div>

                        {Object.entries(groupedTodaysPratos).map(([categoryName, items]) => (
                            <div key={categoryName} className="space-y-4">
                                <h3 className="text-lg font-semibold text-beige-800 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gold rounded-full"></span>
                                    {categoryName}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

                {/* Always Available */}
                {Object.keys(groupedAlwaysAvailable).length > 0 && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        {(selectedCategory === 'Todos' || !['Sopa do Dia', 'Pratos do Dia', 'Sob Encomenda'].includes(selectedCategory)) && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Utensils className="w-6 h-6 text-beige-600" />
                                    <h2 className="text-2xl font-serif font-bold text-beige-900">Sempre Disponível</h2>
                                </div>
                            </div>
                        )}

                        {Object.entries(groupedAlwaysAvailable).map(([categoryName, items]) => {
                            if (!shouldShowSection('Always', categoryName)) return null
                            const isDrinks = isDrinkCategory(categoryName)

                            return (
                                <div key={categoryName} className="space-y-4">
                                    <h3 className="text-lg font-semibold text-beige-800 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-beige-900 rounded-full"></span>
                                        {categoryName}
                                    </h3>
                                    <div className={cn(
                                        "grid gap-4",
                                        isDrinks
                                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    )}>
                                        {(items as any[]).map((item: any) => (
                                            <MenuItem
                                                key={item.id}
                                                item={item}
                                                hideImage={isDrinks}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </section>
                )}

                {/* Advance Order Items */}
                {filteredAdvanceOrder.length > 0 && shouldShowSection('Sob Encomenda') && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-accent" />
                                <h2 className="text-2xl font-serif font-bold text-beige-900">Sob Encomenda</h2>
                            </div>
                            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-0">
                                Requer antecedência
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAdvanceOrder.map((item: any) => (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    hideImage={false}
                                    advanceNotice={item.advance_notice_days}
                                    minimumQuantity={item.minimum_quantity}
                                />
                            ))}
                        </div>
                    </section>
                )}

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
