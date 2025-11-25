'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface MenuFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (item: any) => void
    editingItem?: any
    categories: any[]
}

export function MenuForm({ isOpen, onClose, onSuccess, editingItem, categories }: MenuFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient() as any

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        daily_type: 'none',
        image_url: ''
    })

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                description: editingItem.description || '',
                price: editingItem.price.toString(),
                category_id: editingItem.category_id || '',
                daily_type: editingItem.daily_type || 'none',
                image_url: editingItem.image_url || ''
            })
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: categories[0]?.id || '',
                daily_type: 'none',
                image_url: ''
            })
        }
    }, [editingItem, categories, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload: any = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                daily_type: formData.daily_type,
                image_url: formData.image_url || null,
                is_available: true
            }

            let result
            if (editingItem) {
                const { data, error } = await (supabase
                    .from('menu_items') as any)
                    .update(payload)
                    .eq('id', editingItem.id)
                    .select()
                    .single()

                if (error) throw error
                result = data
                toast.success('Item atualizado com sucesso')
            } else {
                const { data, error } = await (supabase
                    .from('menu_items') as any)
                    .insert(payload)
                    .select()
                    .single()

                if (error) throw error
                result = data
                toast.success('Item criado com sucesso')
            }

            onSuccess(result)
            onClose()
        } catch (error) {
            console.error(error)
            toast.error('Erro ao salvar item')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Preço (€)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={(val: string) => setFormData({ ...formData, category_id: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Especial do Dia</Label>
                            <Select
                                value={formData.daily_type}
                                onValueChange={(val: string) => setFormData({ ...formData, daily_type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum</SelectItem>
                                    <SelectItem value="soup">Sopa do Dia</SelectItem>
                                    <SelectItem value="dish">Prato do Dia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            URL da Imagem
                            {['Cafetaria', 'Bebidas', 'Vinhos', 'Cervejas', 'Refrigerantes', 'Águas'].includes(
                                categories.find(c => c.id === formData.category_id)?.name || ''
                            ) ? ' (Opcional)' : ' (Obrigatório)'}
                        </Label>
                        <Input
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://..."
                            required={!['Cafetaria', 'Bebidas', 'Vinhos', 'Cervejas', 'Refrigerantes', 'Águas'].includes(
                                categories.find(c => c.id === formData.category_id)?.name || ''
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="gold" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
