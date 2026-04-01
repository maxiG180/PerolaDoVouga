'use client'

import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, ShoppingBag, Clock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('id')
    const [order, setOrder] = useState<any>(null)

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                const supabase = createClient()
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
        <div className="min-h-screen flex flex-col bg-stone-50/50">
            <Header />

            <main className="flex-1 flex items-center justify-center py-32 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 border border-stone-100"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight">Encomenda Recebida!</h1>
                        <p className="text-stone-500 leading-relaxed font-medium">
                            Obrigado pela sua preferência. Já recebemos o seu pedido e estamos a preparar tudo com o máximo brio.
                        </p>
                    </div>

                    {order && (
                        <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Número do Pedido</span>
                            <p className="font-serif text-3xl font-bold text-gold-dark">#{order.order_number}</p>
                            <p className="text-xs text-stone-400 mt-2 italic">Guarde este número para o levantamento</p>
                        </div>
                    )}

                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col gap-3 text-stone-400 text-sm italic">
                            <p className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-gold" />
                                <span>Enviámos um comprovativo para o seu email.</span>
                            </p>
                            <p>Se necessitarmos de algum detalhe, entraremos em contacto por telemóvel.</p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Link href="/" className="block">
                                <Button variant="gold" className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-gold/20 hover:scale-[1.02] transition-all cursor-pointer">
                                    Voltar ao Início
                                </Button>
                            </Link>
                            <Link href="/menu" className="block">
                                <Button variant="ghost" className="w-full h-12 rounded-xl text-stone-500 hover:text-gold transition-colors font-medium cursor-pointer">
                                    Fazer novo pedido
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
