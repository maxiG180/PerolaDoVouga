import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900">Encomendas</h1>
            </div>

            <OrdersTable initialOrders={orders || []} />
        </div>
    )
}
