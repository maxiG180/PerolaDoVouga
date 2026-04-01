'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, getLocalDate } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Clock, Calendar, User, Phone, Mail, FileText, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const checkoutSchema = z.object({
    name: z.string().min(2, 'O nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(9, 'Telefone deve ter pelo menos 9 dígitos'),
    pickupDate: z.string().min(1, 'A data de recolha é obrigatória'),
    pickupTime: z.string().min(1, 'A hora de recolha é obrigatória'),
    notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
    const { items, total, clearCart, totalItems } = useCartStore()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const todayDate = getLocalDate()

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            pickupDate: todayDate,
        }
    })

    const onSubmit = async (data: CheckoutForm) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: data.name,
                    customerEmail: data.email,
                    customerPhone: data.phone,
                    pickupDate: data.pickupDate,
                    pickupTime: data.pickupTime,
                    notes: data.notes,
                    items: items,
                    total: total(),
                }),
            })

            if (!response.ok) throw new Error('Erro ao processar pedido')

            const { orderId } = await response.json()
            clearCart()
            router.push(`/order/confirmation?id=${orderId}`)
        } catch (error) {
            toast.error('Ocorreu um erro ao enviar o seu pedido. Por favor, tente novamente.')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-stone-50">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4 pt-32">
                    <div className="text-center space-y-6 max-w-sm">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <ShoppingBag className="w-10 h-10 text-stone-200" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-stone-800">Carrinho Vazio</h1>
                            <p className="text-stone-500">Ainda não escolheu os seus pratos favoritos.</p>
                        </div>
                        <Button onClick={() => router.push('/menu')} variant="gold" className="w-full rounded-full h-12 shadow-lg">
                            Ver Menu do Dia
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-stone-50/50">
            <Header />

            <main className="flex-1 pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-8">
                        <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-gold transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Voltar ao Menu</span>
                        </Link>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">Finalizar Encomenda</h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Summary - Top on Mobile */}
                        <div className="lg:order-2">
                            <Card className="border-stone-100 shadow-xl shadow-stone-200/40 rounded-3xl overflow-hidden sticky top-32">
                                <CardHeader className="bg-stone-50/50 border-b border-stone-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="font-serif text-xl font-bold">Resumo</CardTitle>
                                        <Badge variant="outline" className="border-gold/30 text-gold-dark">
                                            {totalItems()} {totalItems() === 1 ? 'item' : 'items'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                                                    <p className="text-xs text-stone-400">{item.quantity} x {formatPrice(item.price)}</p>
                                                </div>
                                                <span className="font-bold text-stone-800 text-sm">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="border-t border-stone-100 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(total())}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold text-stone-900 pt-2">
                                            <span>Total</span>
                                            <span className="text-gold-dark text-2xl">{formatPrice(total())}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-stone-50 rounded-2xl p-4 flex gap-3 text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                                        <Clock className="w-5 h-5 text-gold shrink-0" />
                                        <span>O pagamento será efetuado no restaurante no momento da recolha.</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2 lg:order-1">
                            <Card className="border-stone-100 shadow-xl shadow-stone-200/20 rounded-3xl overflow-hidden">
                                <CardHeader className="p-6 border-b border-stone-100">
                                    <CardTitle className="font-serif text-xl font-bold">Dados de Recolha</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8">
                                    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" /> Nome Completo
                                                </label>
                                                <Input {...register('name')} placeholder="Como o devemos tratar?" className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                                {errors.name && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.name.message}</span>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5" /> Telemóvel
                                                </label>
                                                <Input {...register('phone')} placeholder="Para qualquer dúvida no pedido" className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                                {errors.phone && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.phone.message}</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" /> Email
                                            </label>
                                            <Input {...register('email')} type="email" placeholder="Para enviarmos o comprovativo" className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                            {errors.email && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.email.message}</span>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" /> Data de Recolha
                                                </label>
                                                <Input {...register('pickupDate')} type="date" min={todayDate} className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                                {errors.pickupDate && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.pickupDate.message}</span>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" /> Hora Estimada
                                                </label>
                                                <Input {...register('pickupTime')} type="time" className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                                {errors.pickupTime && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.pickupTime.message}</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" /> Notas Adicionais (Opcional)
                                            </label>
                                            <Input {...register('notes')} placeholder="Ex: Sem cebola, talheres adicionais..." className="rounded-xl h-12 bg-stone-50/50 border-stone-200 focus:ring-gold/20 focus:border-gold" />
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full h-14 text-base font-bold bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-200 hover:bg-gold transition-all duration-500 active:scale-95 group" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        A Processar...
                                                    </>
                                                ) : (
                                                    'Confirmar Encomenda'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
