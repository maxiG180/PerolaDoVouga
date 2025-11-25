import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const orderSchema = z.object({
    customer: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        pickupTime: z.string(),
        notes: z.string().optional(),
    }),
    items: z.array(z.object({
        menuItemId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        customizations: z.string().optional(),
    })),
    total: z.number(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customer, items, total } = orderSchema.parse(body)

        const supabase = await createClient()
        const orderNumber = `PDV-${Math.floor(1000 + Math.random() * 9000)}` // Simple random ID for MVP

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                pickup_time: new Date().toISOString().split('T')[0] + 'T' + customer.pickupTime + ':00',
                special_instructions: customer.notes,
                total_amount: total,
                status: 'pending'
            } as any)
            .select()
            .single()

        if (orderError || !order) throw orderError

        // 2. Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: (order as any).id,
            menu_item_id: item.menuItemId,
            item_name: item.name,
            item_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems as any)

        if (itemsError) throw itemsError

        // 3. Send Email to Parents (Cafe Owner)
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY)
            await resend.emails.send({
                from: 'Pérola do Vouga <onboarding@resend.dev>',
                to: [process.env.RESEND_TO_EMAIL || 'peroladovougalda@gmail.com'],
                subject: `Nova Encomenda #${orderNumber} - ${customer.name}`,
                html: `
          <h1>Nova Encomenda Recebida!</h1>
          <p><strong>Cliente:</strong> ${customer.name}</p>
          <p><strong>Telefone:</strong> ${customer.phone}</p>
          <p><strong>Hora de Recolha:</strong> ${customer.pickupTime}</p>
          <p><strong>Notas:</strong> ${customer.notes || 'Nenhuma'}</p>
          
          <h2>Detalhes do Pedido:</h2>
          <ul>
            ${items.map((item: any) => `
              <li>${item.quantity}x ${item.name} - ${item.price}€</li>
            `).join('')}
          </ul>
          
          <h3>Total: ${total.toFixed(2)}€</h3>
        `
            })
        }

        return NextResponse.json({ success: true, orderId: (order as any).id, orderNumber })
    } catch (error) {
        console.error('Order error:', error)
        return NextResponse.json(
            { error: 'Failed to process order' },
            { status: 500 }
        )
    }
}
