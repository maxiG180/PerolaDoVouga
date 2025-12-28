import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "../globals.css"
import { Toaster } from "sonner"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ChatWidget } from '@/components/chat/ChatWidget'

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
})

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Pérola do Vouga - Restaurante Português em Lisboa | Av. Alm. Reis",
    description: "Restaurante português autêntico em Lisboa. Comida caseira tradicional, ingredientes frescos, pratos típicos portugueses. Visite-nos na Av. Alm. Reis 243 A.",
    keywords: [
        "Pérola do Vouga",
        "restaurante português Lisboa",
        "comida portuguesa",
        "restaurante Av. Alm. Reis",
        "comida tradicional portuguesa",
        "bacalhau com natas Lisboa",
        "bitoque Lisboa",
        "café restaurante Lisboa",
        "takeaway Lisboa",
        "gastronomia portuguesa",
        "pratos típicos portugueses"
    ],
    authors: [{ name: 'Pérola do Vouga' }],
    openGraph: {
        type: 'website',
        locale: 'pt_PT',
        alternateLocale: 'en_US',
        url: 'https://peroladovouga.com',
        siteName: 'Pérola do Vouga',
        title: 'Pérola do Vouga - Restaurante Português em Lisboa',
        description: 'Restaurante português autêntico em Lisboa. Comida caseira tradicional, ingredientes frescos, pratos típicos portugueses.',
        images: [
            {
                url: '/cafe.jpg',
                width: 1200,
                height: 630,
                alt: 'Pérola do Vouga - Restaurante Português'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pérola do Vouga - Restaurante Português em Lisboa',
        description: 'Comida portuguesa autêntica no coração de Lisboa. Visite-nos!',
        images: ['/cafe.jpg']
    },
    alternates: {
        canonical: 'https://peroladovouga.com',
        languages: {
            'pt-PT': 'https://peroladovouga.com/pt',
            'en-US': 'https://peroladovouga.com/en'
        }
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params
    const messages = await getMessages()

    return (
        <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
            <body className="font-sans antialiased" suppressHydrationWarning>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --background: 0 0% 100%;
                        --foreground: 20 14.3% 4.1%;
                        --card: 0 0% 100%;
                        --card-foreground: 20 14.3% 4.1%;
                        --popover: 0 0% 100%;
                        --popover-foreground: 20 14.3% 4.1%;
                        --primary: 35 29% 76%;
                        --primary-foreground: 24 9.8% 10%;
                        --secondary: 46 65% 52%;
                        --secondary-foreground: 60 9.1% 97.8%;
                        --accent: 174 72% 56%;
                        --accent-foreground: 60 9.1% 97.8%;
                        --muted: 60 4.8% 95.9%;
                        --muted-foreground: 25 5.3% 44.7%;
                        --destructive: 0 84.2% 60.2%;
                        --destructive-foreground: 60 9.1% 97.8%;
                        --border: 20 5.9% 90%;
                        --input: 20 5.9% 90%;
                        --ring: 35 29% 76%;
                        --radius: 0.75rem;
                    }
                    body {
                        background-color: hsl(var(--background));
                        color: hsl(var(--foreground));
                        font-feature-settings: "rlig" 1, "calt" 1;
                    }
                `}} />
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <Toaster position="top-center" richColors />
                    <ChatWidget />
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
