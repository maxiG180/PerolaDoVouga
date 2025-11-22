'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total } = useCartStore()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const handleCheckout = () => {
        setIsOpen(false)
        router.push('/checkout')
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="gold" size="sm" className="gap-2 relative">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden md:inline">Carrinho</span>
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="font-serif text-2xl">Seu Pedido</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                            <p>O seu carrinho está vazio.</p>
                            <Button
                                variant="link"
                                className="mt-4 text-gold"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver Menu
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 bg-beige-100 rounded-md flex items-center justify-center text-2xl shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                        ) : (
                                            '🍽️'
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-muted-foreground hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-gold font-medium mb-2">{formatPrice(item.price)}</p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-beige-100"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-beige-100"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t pt-6 space-y-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatPrice(total())}</span>
                        </div>
                        <Button onClick={handleCheckout} className="w-full h-12 text-lg" variant="gold">
                            Finalizar Pedido
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
