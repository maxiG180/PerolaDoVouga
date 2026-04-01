'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { Plus, Clock, Users, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { PremiumPlaceholder } from './PremiumPlaceholder'

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
    const [isAdded, setIsAdded] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const handleAdd = () => {
        if (isSoldOut) {
            toast.error('Este item está esgotado')
            return
        }
        try {
            setIsAdded(true)
            addItem({
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image_url: item.image_url || undefined
            })
            
            setTimeout(() => setIsAdded(false), 1500)
            toast.success('Adicionado ao carrinho!')
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error('Erro ao adicionar. Por favor, tente novamente.')
            setIsAdded(false)
        }
    }

    return (
        <Card className={cn(
            "overflow-hidden group transition-all duration-300 border border-stone-200/50 shadow-sm hover:shadow-xl bg-white rounded-3xl h-full flex flex-col",
            hideImage ? "hover:-translate-y-0.5" : "hover:-translate-y-1"
        )}>
            {!hideImage && (
                <div className="relative h-20 md:h-28 overflow-hidden shrink-0">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                        />
                    ) : (
                        <PremiumPlaceholder name={item.name} />
                    )}

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg tracking-widest uppercase">
                                ESGOTADO
                            </span>
                        </div>
                    )}

                    {/* Quantity Remaining Badge */}
                    {!isSoldOut && quantityRemaining !== null && quantityRemaining !== undefined && (
                        <div className="absolute top-2 right-2 z-10">
                            <Badge className={cn(
                                "shadow-md px-2 py-0.5 text-[9px]",
                                quantityRemaining <= 3
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-gold hover:bg-gold-dark'
                                )}>
                                🔥 {quantityRemaining}
                            </Badge>
                        </div>
                    )}

                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-stone-900/30 to-transparent pointer-events-none" />
                </div>
            )}

            <div className={cn("flex flex-col flex-1 p-2 md:p-3", hideImage ? "p-2" : "")}>
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className={cn("font-serif font-bold text-stone-800 leading-tight group-hover:text-gold transition-colors duration-300", hideImage ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-sm")}>
                        {item.name}
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] md:text-sm font-bold text-gold-dark tracking-tight whitespace-nowrap">{formatPrice(item.price)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2 relative z-10">
                    <Button
                        onClick={() => {
                            console.log('Adding item:', item.id);
                            handleAdd();
                        }}
                        type="button"
                        className={cn(
                            "flex-1 gap-1.5 transition-all duration-300 rounded-xl shadow-sm border-0 h-9 md:h-10 active:scale-95 cursor-pointer relative z-10 pointer-events-auto",
                            isAdded ? "bg-green-500 text-white" : "bg-stone-900 text-white hover:bg-gold",
                        )}
                    >
                        {isAdded ? (
                            <>
                                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-white">OK!</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-3.5 h-3.5 text-white" />
                                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-white">
                                    Adicionar
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
