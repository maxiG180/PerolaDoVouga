'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { Plus, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MenuItemProps {
    item: {
        id: string
        name: string
        description: string | null
        price: number
        image_url: string | null
        is_available: boolean
    }
    hideImage?: boolean
    quantityRemaining?: number | null
    isSoldOut?: boolean
    advanceNotice?: number
    minimumQuantity?: number
}

export function MenuItem({
    item,
    hideImage = false,
    quantityRemaining,
    isSoldOut,
    advanceNotice,
    minimumQuantity
}: MenuItemProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAdd = () => {
        if (isSoldOut) {
            toast.error('Este item está esgotado')
            return
        }
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
        <Card className={cn(
            "overflow-hidden group transition-all duration-300 border-0 shadow-sm hover:shadow-md bg-white rounded-2xl",
            hideImage ? "hover:-translate-y-0.5" : "hover:-translate-y-1"
        )}>
            {!hideImage && (
                <div className="relative h-48 bg-beige-50 overflow-hidden shrink-0">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-beige-50/50">
                            🍽️
                        </div>
                    )}

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                ESGOTADO
                            </span>
                        </div>
                    )}

                    {/* Quantity Remaining Badge */}
                    {!isSoldOut && quantityRemaining !== null && quantityRemaining !== undefined && (
                        <div className="absolute top-2 right-2">
                            <Badge className={`${quantityRemaining <= 3
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-gold hover:bg-gold-dark'
                                } text-white shadow-sm`}>
                                🔥 {quantityRemaining} restantes
                            </Badge>
                        </div>
                    )}

                    {/* General Unavailable */}
                    {!item.is_available && !isSoldOut && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                Esgotado
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className={cn("flex flex-col flex-grow", hideImage ? "p-3" : "p-4")}>
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className={cn("font-serif font-bold text-beige-900 leading-tight", hideImage ? "text-base" : "text-lg")}>
                        {item.name}
                    </h3>
                    <span className="font-medium text-gold-dark whitespace-nowrap">{formatPrice(item.price)}</span>
                </div>

                {!hideImage && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem] flex-grow">
                        {item.description || 'Sem descrição disponível.'}
                    </p>
                )}

                {/* Advance Order Info */}
                {advanceNotice && (
                    <div className="mb-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-accent">
                            <Clock className="w-3 h-3" />
                            <span>{advanceNotice} dias de antecedência</span>
                        </div>
                        {minimumQuantity && (
                            <div className="flex items-center gap-1 text-xs text-accent">
                                <Users className="w-3 h-3" />
                                <span className="whitespace-nowrap">Mín. {minimumQuantity} un.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* <Button
                    onClick={handleAdd}
                    disabled={!item.is_available || isSoldOut}
                    size={hideImage ? "sm" : "default"}
                    className={cn(
                        "w-full gap-2 bg-beige-100 text-beige-900 hover:bg-gold hover:text-white transition-colors disabled:opacity-50 mt-auto",
                        hideImage ? "h-8 text-xs" : ""
                    )}
                >
                    <Plus className={cn("w-4 h-4", hideImage ? "w-3 h-3" : "")} />
                    {hideImage ? "Adicionar" : "Adicionar ao Pedido"}
                </Button> */}
            </div>
        </Card>
    )
}
