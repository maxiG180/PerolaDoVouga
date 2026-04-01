import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getLocalDate } from '@/lib/utils'
import { Resend } from 'resend'
import { z } from 'zod'

const orderSchema = z.object({
    customer: z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().min(9, 'Telemóvel inválido'),
        pickupDate: z.string(),
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
                customer_email: customer.email || 'nao-fornecido@peroladovouga.pt',
                customer_phone: customer.phone,
                pickup_time: customer.pickupDate + 'T' + customer.pickupTime + ':00',
                special_instructions: customer.notes,
                total_amount: total,
                status: 'pending'
            } as any)
            .select()
            .single()

        if (orderError || !order) {
            console.error('Supabase Order Error:', JSON.stringify(orderError, null, 2))
            throw new Error(`DB_ORDER_ERROR: ${orderError?.message || 'Unknown'}`)
        }

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

        if (itemsError) {
            console.error('Supabase Items Error:', JSON.stringify(itemsError, null, 2))
            throw new Error(`DB_ITEMS_ERROR: ${itemsError?.message || 'Unknown'}`)
        }

        // 3. Send Email to Parents (Cafe Owner)
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY)
                const isFuture = customer.pickupDate !== getLocalDate()
                
                const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'Pérola do Vouga <onboarding@resend.dev>',
                to: [
                    process.env.RESEND_TO_EMAIL || 'peroladovougalda@gmail.com',
                    'ytmax180@gmail.com',
                    'sng.sergio@gmail.com'
                ],
                subject: `${isFuture ? '📝 AGENDADO: ' : '🔔 NOVO: '} Encomenda #${orderNumber} (${customer.pickupDate})`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #854d0e; text-align: center;">Nova Encomenda Recebida!</h1>
            
            ${isFuture ? `
              <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <strong style="color: #854d0e; font-size: 18px;">⚠️ ATENÇÃO: ENCOMENDA PARA OUTRO DIA</strong>
              </div>
            ` : ''}

            <div style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
              <p style="margin: 5px 0;"><strong>Cliente:</strong> ${customer.name}</p>
              <p style="margin: 5px 0;"><strong>Telemóvel:</strong> ${customer.phone}</p>
              ${customer.email ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${customer.email}</p>` : ''}
              <p style="margin: 5px 0; color: #854d0e; font-size: 1.1em;"><strong>DATA DE RECOLHA:</strong> ${customer.pickupDate}</p>
              <p style="margin: 5px 0; color: #854d0e; font-size: 1.1em;"><strong>HORA DE RECOLHA:</strong> ${customer.pickupTime}</p>
              <p style="margin: 15px 0 5px 0;"><strong>Notas do Cliente:</strong></p>
              <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
                ${customer.notes || '<i>Nenhuma nota</i>'}
              </div>
            </div>
            
            <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Detalhes do Pedido:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="text-align: left; border-bottom: 1px solid #eee;">
                  <th style="padding: 10px 0;">Item</th>
                  <th style="padding: 10px 0;">Quant.</th>
                  <th style="padding: 10px 0; text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: any) => `
                  <tr style="border-bottom: 1px solid #f9f9f9; ${item.menuItemId === 'custom-request' ? 'background: #fff9db;' : ''}">
                    <td style="padding: 10px 0;">
                      <strong>${item.name}</strong>
                      ${item.menuItemId === 'custom-request' ? '<br/><span style="color: #999; font-size: 0.8em;">(Pedido Especial)</span>' : ''}
                    </td>
                    <td style="padding: 10px 0;">${item.quantity}x</td>
                    <td style="padding: 10px 0; text-align: right;">${item.price > 0 ? `${item.price.toFixed(2)}€` : '---'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div style="margin-top: 30px; text-align: right; font-size: 20px;">
              <strong>Total: <span style="color: #854d0e;">${total.toFixed(2)}€</span></strong>
            </div>
            
            <div style="margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #eee; pt-10 text-align: center;">
              <p>Este email foi gerado automaticamente pelo site Pérola do Vouga.</p>
            </div>
          </div>
        `
                })

                if (emailError) {
                    console.error('Resend Email Error:', JSON.stringify(emailError, null, 2))
                } else {
                    console.log('Email sent successfully:', emailData?.id)
                }
            } catch (emailCatchError) {
                console.error('Email caught error:', emailCatchError)
            }
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
