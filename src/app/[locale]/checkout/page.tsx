'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const checkoutSchema = z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(9, 'Telefone inválido'),
    pickupTime: z.string().min(1, 'Hora de recolha é obrigatória'),
    notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
    })

    const onSubmit = async (data: CheckoutForm) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: data,
                    items: items,
                    total: total(),
                }),
            })

            if (!response.ok) throw new Error('Erro ao processar pedido')

            const { orderId } = await response.json()
            clearCart()
            router.push(`/order/confirmation?id=${orderId}`)
        } catch (error) {
            toast.error('Erro ao enviar pedido. Por favor tente novamente.')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-serif font-bold mb-4">Carrinho Vazio</h1>
                        <Button onClick={() => router.push('/menu')} variant="gold">
                            Voltar ao Menu
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="font-serif text-3xl font-bold text-primary-900 mb-8">Finalizar Pedido</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Seus Dados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nome Completo</label>
                                        <Input {...register('name')} placeholder="João Silva" />
                                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Email</label>
                                        <Input {...register('email')} type="email" placeholder="joao@exemplo.com" />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Telefone</label>
                                        <Input {...register('phone')} placeholder="912 345 678" />
                                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Hora de Recolha</label>
                                        <Input {...register('pickupTime')} type="time" />
                                        {errors.pickupTime && <span className="text-red-500 text-xs">{errors.pickupTime.message}</span>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Notas (Opcional)</label>
                                        <Input {...register('notes')} placeholder="Ex: Sem cebola..." />
                                    </div>

                                    <Button type="submit" className="w-full mt-6" variant="gold" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            'Confirmar Pedido'
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Resumo do Pedido</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg text-gold-dark">
                                        <span>Total</span>
                                        <span>{formatPrice(total())}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
