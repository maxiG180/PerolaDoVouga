'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Upload, X, Pencil } from 'lucide-react'
import { menuItemSchema, type MenuItemFormData } from '@/lib/validations/menu'
import Image from 'next/image'

interface DishFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export function DishForm({ initialData, onSuccess, onCancel }: DishFormProps) {
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    const form = useForm<MenuItemFormData>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            name: initialData?.name || '',
            name_en: initialData?.name_en || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            category: initialData?.category || '',
            cuisine_type: initialData?.cuisine_type || 'Portuguese',
            photo_url: initialData?.photo_url || '',
            is_available: initialData?.is_available ?? true,
            is_always_available: initialData?.is_always_available ?? false,
            daily_type: initialData?.daily_type || 'none',
            allergens: initialData?.allergens || [],
        },
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(filePath)

            form.setValue('photo_url', publicUrl)
            toast.success('Imagem carregada com sucesso!')
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Erro ao carregar imagem')
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data: MenuItemFormData) => {
        try {
            const { error } = initialData
                ? await supabase
                    .from('menu_items')
                    // @ts-ignore
                    .update(data)
                    .eq('id', initialData.id)
                : await supabase
                    .from('menu_items')
                    // @ts-ignore
                    .insert(data)

            if (error) throw error

            toast.success(initialData ? 'Prato atualizado!' : 'Prato criado!')
            onSuccess()
        } catch (error) {
            console.error('Error saving dish:', error)
            toast.error('Erro ao guardar prato')
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                    <div>
                        <Label>Nome (Português) *</Label>
                        <Input {...form.register('name')} placeholder="Ex: Bacalhau à Brás" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Nome (Inglês)</Label>
                        <Input {...form.register('name_en')} placeholder="Ex: Codfish à Brás" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Preço (€) *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...form.register('price')}
                            />
                            {form.formState.errors.price && (
                                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                            )}
                        </div>
                        <div>
                            <Label>Categoria *</Label>
                            <Select
                                onValueChange={(value) => form.setValue('category', value)}
                                defaultValue={form.getValues('category')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sopas">Sopas</SelectItem>
                                    <SelectItem value="Peixe">Peixe</SelectItem>
                                    <SelectItem value="Carne">Carne</SelectItem>
                                    <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                                    <SelectItem value="Sobremesas">Sobremesas</SelectItem>
                                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.category && (
                                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Tipo de Cozinha</Label>
                        <Select
                            onValueChange={(value: any) => form.setValue('cuisine_type', value)}
                            defaultValue={form.getValues('cuisine_type')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Portuguese">Portuguesa</SelectItem>
                                <SelectItem value="African">Africana</SelectItem>
                                <SelectItem value="Ukrainian">Ucraniana</SelectItem>
                                <SelectItem value="Other">Outra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Descrição</Label>
                        <Textarea {...form.register('description')} placeholder="Breve descrição do prato..." />
                    </div>
                </div>

                {/* Right Column - Photo & Settings */}
                <div className="space-y-4">
                    {form.watch('category') !== 'Bebidas' && (
                        <div>
                            <Label>Foto do Prato *</Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                {form.watch('photo_url') ? (
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={form.watch('photo_url')!}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <label className="p-1 bg-white/90 text-gray-700 rounded-full hover:bg-white cursor-pointer shadow-sm">
                                                <Pencil className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="hidden"
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => form.setValue('photo_url', '')}
                                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500 mb-2">Clique para carregar imagem</p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                            {uploading && <p className="text-sm text-blue-500 mt-1">A carregar imagem...</p>}
                            {form.formState.errors.photo_url && (
                                <p className="text-sm text-red-500">{form.formState.errors.photo_url.message}</p>
                            )}
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <h3 className="font-medium text-gray-900">Configurações</h3>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_always_available"
                                checked={form.watch('is_always_available')}
                                onCheckedChange={(checked) => form.setValue('is_always_available', checked as boolean)}
                            />
                            <Label htmlFor="is_always_available">Sempre Disponível (Menu Fixo)</Label>
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de Prato do Dia</Label>
                            <Select
                                onValueChange={(value: any) => form.setValue('daily_type', value)}
                                defaultValue={form.getValues('daily_type')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum (Apenas Menu Fixo)</SelectItem>
                                    <SelectItem value="soup">Pode ser Sopa do Dia</SelectItem>
                                    <SelectItem value="dish">Pode ser Prato do Dia</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                Define se este item pode ser selecionado no planeamento diário.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || uploading} className="bg-[#D4AF37] hover:bg-[#B39226] text-white">
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            A guardar...
                        </>
                    ) : (
                        'Guardar Prato'
                    )}
                </Button>
            </div>
        </form>
    )
}
