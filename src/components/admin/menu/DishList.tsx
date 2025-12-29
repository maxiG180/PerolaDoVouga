'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Upload, Coffee } from 'lucide-react'

import { DishForm } from './DishForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface DishListProps {
    initialItems: any[]
}

// Category color scheme with vibrant, appetizing colors
const categoryColors = {
    'Sopas': {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-700',
        gradient: 'from-orange-500 to-orange-600',
        light: 'bg-orange-100'
    },
    'Peixe': {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-700',
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-100'
    },
    'Carne': {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-700',
        gradient: 'from-red-500 to-red-600',
        light: 'bg-red-100'
    },
    'Vegetariano': {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-700',
        gradient: 'from-emerald-500 to-emerald-600',
        light: 'bg-emerald-100'
    },
    'Sobremesas': {
        bg: 'bg-pink-50',
        border: 'border-pink-500',
        text: 'text-pink-700',
        gradient: 'from-pink-500 to-pink-600',
        light: 'bg-pink-100'
    },
    'Bebidas': {
        bg: 'bg-teal-50',
        border: 'border-teal-500',
        text: 'text-teal-700',
        gradient: 'from-teal-500 to-teal-600',
        light: 'bg-teal-100'
    }
} as const

export function DishList({ initialItems }: DishListProps) {
    const [items, setItems] = useState(initialItems)
    const [filteredItems, setFilteredItems] = useState(initialItems)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const supabase = createClient()

    // Group items by category for organized display
    const groupedItems = useMemo(() => {
        const categoryOrder = ['Sopas', 'Peixe', 'Carne', 'Vegetariano', 'Sobremesas', 'Bebidas']
        const groups: Record<string, any[]> = {}

        filteredItems.forEach(item => {
            const category = item.category || 'Outros'
            if (!groups[category]) {
                groups[category] = []
            }
            groups[category].push(item)
        })

        // Sort categories by predefined order
        return categoryOrder
            .filter(cat => groups[cat] && groups[cat].length > 0)
            .map(cat => ({ category: cat, items: groups[cat] }))
    }, [filteredItems])

    // Filter logic
    const handleFilter = (search: string, category: string) => {
        let result = [...items]

        if (search) {
            const lowerSearch = search.toLowerCase()
            result = result.filter(item =>
                item.name.toLowerCase().includes(lowerSearch) ||
                item.name_en?.toLowerCase().includes(lowerSearch)
            )
        }

        if (category && category !== 'all') {
            result = result.filter(item => item.category === category)
        }

        setFilteredItems(result)
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        handleFilter(value, categoryFilter)
    }

    const onCategoryChange = (value: string) => {
        setCategoryFilter(value)
        handleFilter(searchTerm, value)
    }

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setIsFormOpen(true)
    }

    const handleCreate = () => {
        setEditingItem(null)
        setIsFormOpen(true)
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        // Refresh data - in a real app we might want to re-fetch or update local state optimistically
        // For now, let's just reload the page to get fresh data from server components
        window.location.reload()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem a certeza que deseja apagar este prato?')) return

        try {
            const { error } = await supabase.from('menu_items').delete().eq('id', id)
            if (error) throw error

            const newItems = items.filter(i => i.id !== id)
            setItems(newItems)
            setFilteredItems(newItems.filter(item => {
                const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
                return matchesSearch && matchesCategory
            }))
            toast.success('Prato apagado com sucesso')
        } catch (error) {
            console.error('Error deleting dish:', error)
            toast.error('Erro ao apagar prato')
        }
    }

    const handleDuplicate = async (item: any) => {
        try {
            const { id, created_at, updated_at, ...itemData } = item
            const newItem = {
                ...itemData,
                name: `${itemData.name} (Cópia)`,
                is_available: false // Default to unavailable for copies
            }

            const { data, error } = await supabase
                .from('menu_items')
                .insert(newItem)
                .select()
                .single()

            if (error) throw error

            setItems([data, ...items])
            setFilteredItems([data, ...filteredItems])
            toast.success('Prato duplicado com sucesso')
        } catch (error) {
            console.error('Error duplicating dish:', error)
            toast.error('Erro ao duplicar prato')
        }
    }

    const toggleAvailability = async (item: any) => {
        try {
            const newValue = !item.is_available
            const { error } = await supabase
                .from('menu_items')
                // @ts-ignore
                .update({ is_available: newValue })
                .eq('id', item.id)

            if (error) throw error

            const updatedItems = items.map(i => i.id === item.id ? { ...i, is_available: newValue } : i)
            setItems(updatedItems)
            setFilteredItems(filteredItems.map(i => i.id === item.id ? { ...i, is_available: newValue } : i))

            toast.success(`Prato marcado como ${newValue ? 'disponível' : 'indisponível'}`)
        } catch (error) {
            console.error('Error updating availability:', error)
            toast.error('Erro ao atualizar disponibilidade')
        }
    }

    const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            const toastId = toast.loading('A carregar imagem...')

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(filePath)

            const { error: updateError } = await supabase
                .from('menu_items')
                // @ts-ignore
                .update({ photo_url: publicUrl })
                .eq('id', item.id)

            if (updateError) throw updateError

            // Update local state
            const updatedItems = items.map(i => i.id === item.id ? { ...i, photo_url: publicUrl } : i)
            setItems(updatedItems)
            setFilteredItems(filteredItems.map(i => i.id === item.id ? { ...i, photo_url: publicUrl } : i))

            toast.dismiss(toastId)
            toast.success('Imagem atualizada com sucesso!')
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Erro ao carregar imagem')
        }
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar pratos..."
                            value={searchTerm}
                            onChange={onSearchChange}
                            className="pl-8"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={onCategoryChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Sopas">Sopas</SelectItem>
                            <SelectItem value="Peixe">Peixe</SelectItem>
                            <SelectItem value="Carne">Carne</SelectItem>
                            <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                            <SelectItem value="Sobremesas">Sobremesas</SelectItem>
                            <SelectItem value="Bebidas">Bebidas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="bg-[#D4AF37] hover:bg-[#B39226] text-white gap-2 w-full sm:w-auto" onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Novo Prato
                </Button>
            </div>

            {/* Category-based Grid Layout */}
            {groupedItems.length > 0 ? (
                <div className="space-y-8">
                    {groupedItems.map(({ category, items }) => {
                        const colors = categoryColors[category as keyof typeof categoryColors]

                        return (
                            <div key={category} className="space-y-4">
                                {/* Category Header */}
                                <div className={cn(
                                    "flex items-center gap-3 pb-3 border-b-2",
                                    colors.border
                                )}>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full bg-gradient-to-r text-white font-semibold text-sm shadow-md",
                                        colors.gradient
                                    )}>
                                        {category}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {items.length} {items.length === 1 ? 'prato' : 'pratos'}
                                    </span>
                                </div>

                                {/* Dishes Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "rounded-xl p-4 shadow-sm border-2 transition-all hover:shadow-md",
                                                colors.bg,
                                                colors.border,
                                                "hover:scale-[1.02]"
                                            )}
                                        >
                                            {/* Image */}
                                            {category !== 'Bebidas' && (
                                                <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-white group cursor-pointer">
                                                    <label className="absolute inset-0 cursor-pointer z-10">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleQuickImageUpload(e, item)}
                                                        />
                                                        {item.photo_url ? (
                                                            <>
                                                                <Image
                                                                    src={item.photo_url}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Upload className="w-8 h-8 text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={cn(
                                                                "flex flex-col items-center justify-center h-full text-gray-400 transition-colors",
                                                                colors.light,
                                                                "group-hover:bg-gray-100"
                                                            )}>
                                                                <Upload className="w-8 h-8 mb-1" />
                                                                <span className="text-xs">Adicionar foto</span>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            )}

                                            {category === 'Bebidas' && (
                                                <div className={cn(
                                                    "w-full aspect-square mb-3 flex items-center justify-center rounded-lg",
                                                    colors.light
                                                )}>
                                                    <Coffee className={cn("w-12 h-12", colors.text)} />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
                                                        {item.name}
                                                    </h3>
                                                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                </div>

                                                {item.name_en && (
                                                    <p className="text-xs text-gray-500 line-clamp-1">{item.name_en}</p>
                                                )}

                                                {/* Type Badges */}
                                                <div className="flex flex-wrap gap-1">
                                                    {item.is_always_available && (
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                                                            Menu Fixo
                                                        </span>
                                                    )}
                                                    {item.daily_type === 'soup' && (
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-medium rounded-full">
                                                            Sopa Dia
                                                        </span>
                                                    )}
                                                    {item.daily_type === 'dish' && (
                                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-medium rounded-full">
                                                            Prato Dia
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Availability Toggle */}
                                                <button
                                                    onClick={() => toggleAvailability(item)}
                                                    className={cn(
                                                        "w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                                        item.is_available
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    )}
                                                >
                                                    {item.is_available ? '✓ Disponível' : '✕ Esgotado'}
                                                </button>

                                                {/* Action Buttons */}
                                                <div className="flex gap-1 pt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="flex-1 h-8 text-xs hover:bg-white/50"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <Pencil className="w-3 h-3 mr-1" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 px-2 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 mb-3">
                        <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    </div>
                    <p className="text-gray-600 font-medium">
                        {searchTerm || categoryFilter !== 'all'
                            ? 'Nenhum prato encontrado com esses filtros.'
                            : 'Sem pratos no menu.'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {!searchTerm && categoryFilter === 'all' && 'Clique em "Novo Prato" para adicionar.'}
                    </p>
                </div>
            )}

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? 'Editar Prato' : 'Novo Prato'}
                        </DialogTitle>
                    </DialogHeader>
                    <DishForm
                        initialData={editingItem}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
