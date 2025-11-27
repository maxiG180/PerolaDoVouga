import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
    try {
        const { message, conversationId } = await request.json()

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)

        // Send email to admin
        await resend.emails.send({
            from: 'Pérola do Vouga <onboarding@resend.dev>',
            to: process.env.RESEND_TO_EMAIL || 'peroladovougalda@gmail.com',
            subject: 'Nova Mensagem de Suporte',
            html: `
                <h1>Nova Mensagem de Cliente</h1>
                <p>Você recebeu uma nova mensagem no chat de suporte.</p>
                <p><strong>Mensagem:</strong> ${message}</p>
                <br />
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/chat" style="background-color: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Responder no Dashboard
                </a>
            `
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sending notification:', error)
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }
}
