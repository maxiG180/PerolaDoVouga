'use client'
import { Link } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { Menu, ShoppingBag, X, Phone, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface RestaurantSettings {
    phone: string
    email: string
    address: string
    opening_hours: string
    opening_hours_weekend: string
}

export function Header() {
    const t = useTranslations('nav')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [settings, setSettings] = useState<RestaurantSettings | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)

        const fetchSettings = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('restaurant_settings')
                .select('*')
                .single()
            if (data) setSettings(data)
        }
        fetchSettings()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const phone = settings?.phone || '+351 21 846 4584'
    const address = settings?.address || 'Av. Alm. Reis 243 A, 1000-051 Lisboa'
    const hours = settings?.opening_hours || '07:00 - 18:00'

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col',
                isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'
            )}
        >
            {/* Top Bar - Info */}
            <div className="bg-primary-900 text-white text-[11px] py-1.5 hidden lg:block">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gold" />
                            <span>{address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gold" />
                            <span>Seg-Sex: {hours}</span>
                        </div>
                    </div>
                    {/* <div className="text-gold font-medium tracking-wider text-[10px] uppercase">
                        Experience the Flavor of Vouga
                    </div> */}
                </div>
            </div>

            <div className={cn("container mx-auto px-4 flex items-center justify-between transition-all duration-300", isScrolled ? "py-2" : "py-3")}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110 duration-300">
                        <Image
                            src="/logo.png"
                            alt="Pérola do Vouga Logo"
                            fill
                            className="object-contain drop-shadow-md"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-lg md:text-xl font-bold leading-none tracking-tight text-beige-900">
                            Pérola do Vouga
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5 text-gold-dark">
                            Café & Restaurante
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-beige-900 hover:text-gold transition-colors">
                        {t('home')}
                    </Link>
                    {/* <Link href="/menu" className="text-sm font-medium text-beige-900 hover:text-gold transition-colors">
                        {t('menu')}
                    </Link> */}
                    <Link href="/about" className="text-sm font-medium text-beige-900 hover:text-gold transition-colors">
                        {t('about')}
                    </Link>

                    <div className="h-6 w-px bg-gold/30 mx-2"></div>

                    <div className="flex items-center gap-4">
                        <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-medium text-beige-900 hover:text-gold transition-colors">
                            <Phone className="w-4 h-4" />
                            <span className="hidden xl:inline">{phone}</span>
                        </a>

                        <LanguageSwitcher />
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <LanguageSwitcher />
                    <button
                        className="p-2 rounded-full text-beige-900 hover:bg-beige-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t p-4 md:hidden shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5 h-screen">
                    <Link
                        href="/"
                        className="p-4 hover:bg-beige-50 rounded-xl text-lg font-medium border border-transparent hover:border-beige-200 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('home')}
                    </Link>
                    {/* <Link
                        href="/menu"
                        className="p-4 hover:bg-beige-50 rounded-xl text-lg font-medium border border-transparent hover:border-beige-200 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('menu')}
                    </Link> */}
                    <Link
                        href="/about"
                        className="p-4 hover:bg-beige-50 rounded-xl text-lg font-medium border border-transparent hover:border-beige-200 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('about')}
                    </Link>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 px-4">
                        <div className="flex items-center gap-3 text-stone-600">
                            <Clock className="w-5 h-5 text-gold" />
                            <span>{hours}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                            <MapPin className="w-5 h-5 text-gold" />
                            <span className="text-sm">{address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                            <Phone className="w-5 h-5 text-gold" />
                            <span>{phone}</span>
                        </div>
                    </div>

                </div>
            )}
        </header>
    )
}
