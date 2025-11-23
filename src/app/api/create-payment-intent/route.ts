import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
    try {
        const { amount, orderNumber, customerEmail } = await req.json();

        if (!amount || !orderNumber || !customerEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // If using placeholder key, return mock response
        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn('Stripe not configured - returning mock payment intent');
            return NextResponse.json({
                clientSecret: 'mock_client_secret_for_testing'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'eur',
            metadata: {
                order_number: orderNumber,
            },
            receipt_email: customerEmail,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
