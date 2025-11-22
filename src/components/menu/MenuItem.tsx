'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface MenuItemProps {
    item: {
        id: string
        name: string
        description: string | null
        price: number
        image_url: string | null
        is_available: boolean
    }
}

export function MenuItem({ item }: MenuItemProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAdd = () => {
        addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image_url: item.image_url || undefined
        })
        toast.success('Adicionado ao carrinho!')
    }

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-beige-200">
            <div className="relative h-48 bg-beige-100 overflow-hidden">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                    </div>
                )}
                {!item.is_available && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Esgotado
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif font-bold text-lg text-primary-900 line-clamp-1">{item.name}</h3>
                    <span className="font-medium text-gold-dark">{formatPrice(item.price)}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                    {item.description || 'Sem descrição disponível.'}
                </p>

                <Button
                    onClick={handleAdd}
                    disabled={!item.is_available}
                    className="w-full gap-2 bg-beige-200 text-primary-900 hover:bg-gold hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar
                </Button>
            </div>
        </Card>
    )
}
