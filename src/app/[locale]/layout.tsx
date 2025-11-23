import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "../globals.css"
import { Toaster } from "sonner"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

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
    title: "Pérola do Vouga - Sabores que Encantam",
    description: "Uma experiência gastronómica única onde a tradição encontra a elegância. Pratos feitos com amor, ingredientes frescos e o toque especial da nossa família.",
    keywords: ["restaurante", "comida portuguesa", "takeaway", "Vouga", "gastronomia"],
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
            <body className="font-sans antialiased">
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
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
