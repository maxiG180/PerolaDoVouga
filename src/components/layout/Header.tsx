'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
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
                isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
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
                        <span className="font-serif text-xl font-bold text-primary-900 leading-none tracking-tight">
                            Pérola do Vouga
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium mt-0.5">
                            Takeaway & Café
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium hover:text-gold transition-colors">
                        Início
                    </Link>
                    <Link href="/menu" className="text-sm font-medium hover:text-gold transition-colors">
                        Menu
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-gold transition-colors">
                        Sobre Nós
                    </Link>
                    <Button variant="gold" size="sm" className="gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Encomendar
                    </Button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t p-4 md:hidden shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <Link
                        href="/"
                        className="p-2 hover:bg-beige-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Início
                    </Link>
                    <Link
                        href="/menu"
                        className="p-2 hover:bg-beige-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Menu
                    </Link>
                    <Link
                        href="/about"
                        className="p-2 hover:bg-beige-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Sobre Nós
                    </Link>
                    <Button className="w-full gap-2" variant="gold">
                        <ShoppingBag className="w-4 h-4" />
                        Ver Carrinho
                    </Button>
                </div>
            )}
        </header>
    )
}
