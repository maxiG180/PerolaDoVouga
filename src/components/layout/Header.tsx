'use client'

import { Link } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { Menu, ShoppingBag, X, Phone } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export function Header() {
    const t = useTranslations('nav')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-300">
                        <Image
                            src="/logo.png"
                            alt="Pérola do Vouga Logo"
                            fill
                            className="object-contain drop-shadow-md"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold leading-none tracking-tight text-beige-900">
                            Pérola do Vouga
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5 text-gold-dark">
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
                        <a href="tel:+351218464584" className="flex items-center gap-2 text-sm font-medium text-beige-900 hover:text-gold transition-colors">
                            <Phone className="w-4 h-4" />
                            <span className="hidden lg:inline">+351 21 846 4584</span>
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

                </div>
            )}
        </header>
    )
}
