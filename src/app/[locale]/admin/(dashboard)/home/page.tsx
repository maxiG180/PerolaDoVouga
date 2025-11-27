import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, ShoppingBag, MessageCircle, ArrowRight, AlertCircle, CheckCircle2, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayStr = format(today, 'yyyy-MM-dd')
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')

    // Fetch stats
    const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStr)

    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    const { count: activeChats } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // Check planning status
    const { data: todayPlan } = await supabase
        .from('daily_menus')
        .select('id')
        .eq('date', todayStr)
        .single()

    const { data: tomorrowPlan } = await supabase
        .from('daily_menus')
        .select('id')
        .eq('date', tomorrowStr)
        .single()

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-3xl font-serif font-bold text-primary-900">Painel de Controlo</h1>

            {/* Planning Status Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className={`border-l-4 ${todayPlan ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menu de Hoje ({format(today, 'dd/MM')})</CardTitle>
                        {todayPlan ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">{todayPlan ? 'Configurado' : 'Não Configurado'}</div>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/admin/planning">
                                Ver Menu de Hoje <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${tomorrowPlan ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menu de Amanhã ({format(tomorrow, 'dd/MM')})</CardTitle>
                        {tomorrowPlan ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">{tomorrowPlan ? 'Pronto' : 'Pendente'}</div>
                        <Button asChild className={tomorrowPlan ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} size="sm">
                            <Link href="/admin/planning" className="w-full flex items-center justify-center text-white">
                                {tomorrowPlan ? 'Editar Planeamento' : 'Configurar Agora'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Encomendas Hoje</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingOrders || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chats Ativos</CardTitle>
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{activeChats || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild size="lg" className="h-24 text-lg flex flex-col items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 shadow-md transition-all hover:scale-[1.02]">
                    <Link href="/admin/orders">
                        <ShoppingBag className="h-8 w-8" />
                        Gerir Encomendas
                    </Link>
                </Button>
                <Button asChild size="lg" className="h-24 text-lg flex flex-col items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B39226] text-white shadow-md transition-all hover:scale-[1.02]">
                    <Link href="/admin/planning">
                        <CalendarDays className="h-8 w-8" />
                        Planeamento Diário
                    </Link>
                </Button>
                <Button asChild size="lg" className="h-24 text-lg flex flex-col items-center justify-center gap-2 bg-white text-primary-900 border-2 border-primary-900 hover:bg-gray-50 shadow-sm transition-all hover:scale-[1.02]">
                    <Link href="/admin/menu">
                        <UtensilsCrossed className="h-8 w-8" />
                        Gerir Menu
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-24 text-lg flex flex-col items-center justify-center gap-2 border-2 hover:bg-gray-50 shadow-sm transition-all hover:scale-[1.02]">
                    <Link href="/admin/chat">
                        <MessageCircle className="h-8 w-8" />
                        Chat Suporte
                    </Link>
                </Button>
            </div>
        </div>
    )
}
