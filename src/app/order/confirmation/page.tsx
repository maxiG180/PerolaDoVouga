'use client'

import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('id')
    const [order, setOrder] = useState<any>(null)

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                const supabase = createClient()
                // Note: In a real app, we'd need a secure way to fetch this without exposing all orders
                // For MVP, we rely on the ID being known only to the creator immediately after creation
                // Or we could use a signed token. For now, we'll just show a generic success if fetch fails due to RLS.
                const { data } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single()

                if (data) setOrder(data)
            }
            fetchOrder()
        }
    }, [orderId])

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 flex items-center justify-center py-24 px-4">
                <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gold/20">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <div>
                        <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">Pedido Confirmado!</h1>
                        <p className="text-muted-foreground">
                            Obrigado pela sua encomenda. Recebemos o seu pedido e vamos começar a prepará-lo.
                        </p>
                    </div>

                    {order && (
                        <div className="bg-beige-100 p-4 rounded-lg">
                            <p className="font-bold text-lg">#{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">Guarde este número</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Enviámos um email de confirmação para o café. <br />
                            Se necessário, entraremos em contacto consigo.
                        </p>

                        <Link href="/" className="block">
                            <Button variant="gold" className="w-full">
                                Voltar ao Início
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
