'use client'

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
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn(
                "overflow-hidden group transition-all duration-300 border border-stone-200/50 shadow-sm hover:shadow-2xl bg-white rounded-3xl",
                hideImage ? "hover:-translate-y-0.5" : ""
            )}>
                {!hideImage && (
                    <div className="relative h-28 md:h-36 lg:h-40 overflow-hidden shrink-0">
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
                                <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-widest uppercase">
                                    ESGOTADO
                                </span>
                            </div>
                        )}

                        {/* Quantity Remaining Badge */}
                        {!isSoldOut && quantityRemaining !== null && quantityRemaining !== undefined && (
                            <div className="absolute top-3 right-3 z-10">
                                <Badge className={cn(
                                    "shadow-md px-3 py-1 scale-90 md:scale-100",
                                    quantityRemaining <= 3
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-gold hover:bg-gold-dark'
                                    )}>
                                    🔥 {quantityRemaining} restantes
                                </Badge>
                            </div>
                        )}

                        {/* Elegant Glass Header */}
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-stone-900/40 to-transparent pointer-events-none" />
                    </div>
                )}

                <div className={cn("flex flex-col p-2 md:p-3", hideImage ? "p-2" : "")}>
                    <div className="flex justify-between items-start mb-2 gap-3">
                        <h3 className={cn("font-serif font-bold text-stone-800 leading-tight group-hover:text-gold transition-colors duration-300", hideImage ? "text-[10px] md:text-xs" : "text-xs md:text-base")}>
                            {item.name}
                        </h3>
                        <div className="flex flex-col items-end">
                            <span className="text-xs md:text-base font-bold text-gold-dark tracking-tight">{formatPrice(item.price)}</span>
                        </div>
                    </div>

                    {/* Description removed for simplicity as requested */}

                    {/* Advance Order Info */}
                    {advanceNotice && (
                        <div className="mb-4 p-3 rounded-2xl bg-accent/5 flex items-center justify-between border border-accent/10">
                            <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold">
                                <Clock className="w-3.5 h-3.5 text-accent" />
                                <span>{advanceNotice} dias</span>
                            </div>
                            {minimumQuantity && (
                                <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold">
                                    <Users className="w-3.5 h-3.5 text-accent" />
                                    <span>Mín. {minimumQuantity}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-auto pt-2">
                        <Button
                            onClick={handleAdd}
                            disabled={!item.is_available || isSoldOut}
                            className={cn(
                                "flex-1 gap-2 bg-stone-900 text-white hover:bg-gold hover:text-white transition-all duration-500 rounded-2xl shadow-sm hover:shadow-xl border-0 h-11 active:scale-95",
                                hideImage ? "h-9 px-2" : ""
                            )}
                        >
                            <Plus className={cn("w-3 h-3 md:w-4 md:h-4")} />
                            <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">
                                {hideImage ? "Add" : "Adicionar"}
                            </span>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
