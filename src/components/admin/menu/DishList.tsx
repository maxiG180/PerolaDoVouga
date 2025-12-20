'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Copy, Image as ImageIcon, Upload, Coffee } from 'lucide-react'

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

export function DishList({ initialItems }: DishListProps) {
    const [items, setItems] = useState(initialItems)
    const [filteredItems, setFilteredItems] = useState(initialItems)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const supabase = createClient()

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
        <div className="space-y-6">
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
                <Button className="bg-[#D4AF37] hover:bg-[#B39226] text-white gap-2" onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Novo Prato
                </Button>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                        {/* Image */}
                        {item.category !== 'Bebidas' && (
                            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 group cursor-pointer">
                                <label className="absolute inset-0 cursor-pointer">
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
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                    )}
                                </label>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900 truncate pr-2">{item.name}</h3>
                                    <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{item.category}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <button
                                    onClick={() => toggleAvailability(item)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${item.is_available
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {item.is_available ? 'Disponível' : 'Esgotado'}
                                </button>

                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                        <Pencil className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-white rounded-xl">
                        {searchTerm ? 'Nenhum prato encontrado.' : 'Sem pratos no menu.'}
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-white rounded-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                            <TableHead className="w-[80px] font-semibold text-gray-600">Foto</TableHead>
                            <TableHead className="font-semibold text-gray-600">Nome</TableHead>
                            <TableHead className="font-semibold text-gray-600">Categoria</TableHead>
                            <TableHead className="font-semibold text-gray-600">Preço</TableHead>
                            <TableHead className="font-semibold text-gray-600">Estado</TableHead>
                            <TableHead className="font-semibold text-gray-600">Tipo</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
                            <TableRow key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <TableCell>
                                    {item.category !== 'Bebidas' ? (
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 group cursor-pointer">
                                            <label className="absolute inset-0 cursor-pointer">
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
                                                            className="object-cover transition-opacity group-hover:opacity-75"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                                                            <Upload className="w-4 h-4 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400 group-hover:bg-gray-200 transition-colors">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-md text-gray-300">
                                            <Coffee className="w-5 h-5" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div>{item.name}</div>
                                    {item.name_en && (
                                        <div className="text-xs text-muted-foreground">{item.name_en}</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.category}</Badge>
                                </TableCell>
                                <TableCell>{formatPrice(item.price)}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${item.is_available
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {item.is_available ? 'Disponível' : 'Esgotado'}
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {item.is_always_available && (
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none w-fit">Menu Fixo</Badge>
                                        )}
                                        {item.daily_type === 'soup' && (
                                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none w-fit">Sopa Dia</Badge>
                                        )}
                                        {item.daily_type === 'dish' && (
                                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none w-fit">Prato Dia</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            title="Duplicar"
                                            onClick={() => handleDuplicate(item)}
                                        >
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            title="Editar"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            title="Apagar"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    {searchTerm ? 'Nenhum prato encontrado com essa pesquisa.' : 'Sem pratos no menu.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
