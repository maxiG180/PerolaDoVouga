'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { toast } from 'sonner'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Aceite', color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'A Preparar', color: 'bg-purple-100 text-purple-800' },
    ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
    completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
}

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders)
    const supabase = createClient() as any
    const router = useRouter()

    // Update local state when initialOrders changes (e.g. after router.refresh())
    useEffect(() => {
        setOrders(initialOrders)
    }, [initialOrders])

    useEffect(() => {
        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        toast.success(`Nova encomenda recebida! #${payload.new.order_number}`)
                        // Play notification sound
                        try {
                            const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                            audio.play().catch(e => console.log('Audio play failed:', e))
                        } catch (e) {
                            console.error('Error playing sound:', e)
                        }
                        router.refresh()
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((currentOrders: any[]) =>
                            currentOrders.map((order) =>
                                order.id === payload.new.id
                                    ? { ...order, ...payload.new }
                                    : order
                            )
                        )
                        router.refresh()
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus } as any)
                .eq('id', orderId)

            if (error) throw error

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            toast.success('Estado atualizado com sucesso')
        } catch (error) {
            toast.error('Erro ao atualizar estado')
            // Revert on error would be ideal, but simple toast is okay for now
        }
    }

    return (
        <div className="space-y-6">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {format(new Date(order.pickup_time), "HH:mm, dd MMM", { locale: pt })}
                                    </p>
                                </div>
                                <Select
                                    defaultValue={order.status}
                                    onValueChange={(val: string) => handleStatusChange(order.id, val)}
                                >
                                    <SelectTrigger className={`w-[130px] h-8 ${STATUS_MAP[order.status]?.color || ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-1">Cliente</h4>
                                <p className="text-sm">{order.customer_name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-2">Itens</h4>
                                <div className="space-y-1">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="text-sm flex justify-between">
                                            <span>{item.quantity}x {item.item_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center">
                                <span className="font-medium">Total</span>
                                <span className="text-lg font-bold text-gold">{formatPrice(order.total_amount)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground bg-white rounded-xl border border-dashed">
                        Sem encomendas para mostrar.
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nº Pedido</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Itens</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Recolha</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.customer_name}</span>
                                        <span className="text-xs text-muted-foreground">{order.customer_phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm max-w-[200px]">
                                        {order.order_items?.map((item: any) => (
                                            <div key={item.id} className="truncate">
                                                {item.quantity}x {item.item_name}
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                                <TableCell>
                                    {format(new Date(order.pickup_time), "HH:mm, dd MMM", { locale: pt })}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val: string) => handleStatusChange(order.id, val)}
                                    >
                                        <SelectTrigger className={`w-[130px] h-8 ${STATUS_MAP[order.status]?.color || ''}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Sem encomendas para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
