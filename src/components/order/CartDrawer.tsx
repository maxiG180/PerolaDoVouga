'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total, totalItems } = useCartStore()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const count = totalItems()

    const handleCheckout = () => {
        setIsOpen(false)
        router.push('/checkout')
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gold/10 transition-colors rounded-full w-10 h-10 cursor-pointer group">
                    <ShoppingBag className="w-5 h-5 text-stone-700 group-hover:text-gold transition-colors" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm animate-in zoom-in border border-white">
                            {count}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-stone-100 shadow-2xl bg-white">
                <SheetHeader className="p-6 border-b border-stone-50 bg-stone-50/50">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="font-serif text-2xl font-bold text-stone-800">A Sua Encomenda</SheetTitle>
                        <Badge className="bg-gold/10 border-gold/20 text-gold-dark px-3 py-1 rounded-full capitalize font-bold">
                            {count} {count === 1 ? 'item' : 'items'}
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide bg-white">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                                <ShoppingBag className="w-10 h-10 text-stone-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-serif text-xl font-bold text-stone-400">O seu carrinho está vazio</p>
                                <p className="text-sm text-stone-400 max-w-[200px] mx-auto">Ainda não adicionou pratos deliciosos ao seu pedido.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4 rounded-full border-stone-200 text-stone-600 hover:border-gold hover:text-gold transition-all cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                Explorar Ementa
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-stone-100 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-stone-100">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                <ShoppingBag className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col py-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-stone-800 text-sm leading-tight line-clamp-1">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-stone-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-gold-dark font-bold text-sm mb-auto">{formatPrice(item.price)}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-stone-200 rounded-full px-1 py-1 h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold text-stone-700">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-stone-100 bg-white space-y-4">
                        <div className="flex justify-between items-center text-stone-500 text-sm">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatPrice(total())}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-stone-900 pt-1">
                            <span>Total Estimado</span>
                            <span className="text-gold-dark text-2xl font-serif">{formatPrice(total())}</span>
                        </div>
                        <Button 
                            onClick={handleCheckout} 
                            className="w-full h-14 text-base font-bold bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-200 hover:bg-gold transition-all duration-500 active:scale-95 group cursor-pointer"
                        >
                            Finalizar Encomenda
                        </Button>
                        <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest font-bold">
                            Pagamento no restaurante ao levantar
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
