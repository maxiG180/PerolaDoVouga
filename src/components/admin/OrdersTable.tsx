'use client'

import { useState } from 'react'
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

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus } as any)
                .eq('id', orderId)

            if (error) throw error

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            toast.success('Estado atualizado com sucesso')
        } catch (error) {
            toast.error('Erro ao atualizar estado')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
    )
}
