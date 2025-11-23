import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateOrderTotals, generateOrderNumber } from '@/lib/order-utils';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface OrderItem {
    menuItemId?: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: string;
}

interface OrderData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    pickupTime: string;
    items: OrderItem[];
    specialInstructions?: string;
    paymentMethod: 'online' | 'pickup';
    stripePaymentIntentId?: string;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const orderData: OrderData = await req.json();

        // Calculate totals
        const subtotal = orderData.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        const { stripeFee, total } = calculateOrderTotals(
            subtotal,
            orderData.paymentMethod
        );

        const orderNumber = generateOrderNumber();

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                customer_email: orderData.customerEmail,
                pickup_time: orderData.pickupTime,
                special_instructions: orderData.specialInstructions,
                total_amount: total,
                payment_method: orderData.paymentMethod,
                payment_status: orderData.paymentMethod === 'online' ? 'paid' : 'pending',
                stripe_payment_intent_id: orderData.stripePaymentIntentId,
                stripe_fee: stripeFee,
                status: 'pending',
            })
            .select()
            .single();

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // Insert order items
        const orderItems = orderData.items.map(item => ({
            order_id: order.id,
            menu_item_id: item.menuItemId,
            item_name: item.name,
            item_price: item.price,
            quantity: item.quantity,
            customizations: item.customizations,
            subtotal: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }

        // Update quantities for daily items
        const today = new Date().toISOString().split('T')[0];
        for (const item of orderData.items) {
            if (item.menuItemId) {
                await updateDailyItemQuantity(supabase, item.menuItemId, item.quantity, today);
            }
        }

        // Send confirmation email
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Pérola do Vouga <orders@peroladovouga.pt>',
                    to: orderData.customerEmail,
                    subject: `Pedido Confirmado - ${orderNumber}`,
                    html: `
            <h2>Obrigado pelo seu pedido!</h2>
            <p>Número do pedido: <strong>${orderNumber}</strong></p>
            <p>Nome: ${orderData.customerName}</p>
            <p>Hora de levantamento: ${new Date(orderData.pickupTime).toLocaleString('pt-PT')}</p>
            
            <h3>Itens:</h3>
            <ul>
              ${orderData.items.map(item => `
                <li>${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
            
            <p><strong>Subtotal: €${subtotal.toFixed(2)}</strong></p>
            ${stripeFee > 0 ? `<p>Taxa de pagamento online: €${stripeFee.toFixed(2)}</p>` : ''}
            <p><strong>Total: €${total.toFixed(2)}</strong></p>
            <p>Método de pagamento: ${orderData.paymentMethod === 'online' ? 'Pago Online' : 'Pagar ao Levantar'}</p>
            
            <p>Até breve!</p>
            <p>Pérola do Vouga</p>
          `,
                });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Don't fail the order if email fails
            }
        } else {
            console.log('Resend not configured - skipping email notification');
        }

        return NextResponse.json({ success: true, order, orderNumber });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function updateDailyItemQuantity(
    supabase: any,
    menuItemId: string,
    quantityOrdered: number,
    orderDate: string
) {
    // Get today's planning
    const { data: planning } = await supabase
        .from('daily_menu_planning')
        .select('id')
        .eq('date', orderDate)
        .single();

    if (!planning) return;

    // Get current daily_menu_item
    const { data: dailyItem } = await supabase
        .from('daily_menu_items')
        .select('*')
        .eq('planning_id', planning.id)
        .eq('menu_item_id', menuItemId)
        .single();

    if (!dailyItem) return;

    const newQuantitySold = dailyItem.quantity_sold + quantityOrdered;
    const isSoldOut = dailyItem.quantity_available
        ? newQuantitySold >= dailyItem.quantity_available
        : false;

    // Update quantity sold
    await supabase
        .from('daily_menu_items')
        .update({
            quantity_sold: newQuantitySold,
            is_sold_out: isSoldOut,
        })
        .eq('id', dailyItem.id);
}
