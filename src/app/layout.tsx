import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt" className={`${playfair.variable} ${inter.variable}`}>
            <body className="font-sans antialiased">
                {children}
                <Toaster position="top-center" richColors />
            </body>
        </html>
    )
}
