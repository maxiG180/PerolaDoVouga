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
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { MenuForm } from './MenuForm'

export function MenuTable({ initialItems, categories }: { initialItems: any[], categories: any[] }) {
    const [items, setItems] = useState(initialItems)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const supabase = createClient()

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setIsFormOpen(true)
    }

    const handleCreate = () => {
        setEditingItem(null)
        setIsFormOpen(true)
    }

    const handleFormSuccess = (item: any) => {
        if (editingItem) {
            setItems(items.map(i => i.id === item.id ? item : i))
        } else {
            setItems([item, ...items])
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem a certeza que deseja apagar este item?')) return

        try {
            const { error } = await supabase.from('menu_items').delete().eq('id', id)
            if (error) throw error

            setItems(items.filter(i => i.id !== id))
            toast.success('Item apagado com sucesso')
        } catch (error) {
            toast.error('Erro ao apagar item')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="gold" className="gap-2" onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Novo Item
                </Button>
            </div>

            <MenuForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
                editingItem={editingItem}
                categories={categories}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Tipo Diário</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div>{item.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                                </TableCell>
                                <TableCell>
                                    {categories.find(c => c.id === item.category_id)?.name || '-'}
                                </TableCell>
                                <TableCell>{formatPrice(item.price)}</TableCell>
                                <TableCell>
                                    {item.daily_type === 'soup' && <Badge className="bg-turquoise text-white hover:bg-turquoise-dark">Sopa</Badge>}
                                    {item.daily_type === 'dish' && <Badge className="bg-gold text-white hover:bg-gold-dark">Prato</Badge>}
                                    {(!item.daily_type || item.daily_type === 'none') && <span className="text-muted-foreground text-sm">-</span>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Sem itens no menu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
