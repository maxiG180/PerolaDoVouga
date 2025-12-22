'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UtensilsCrossed, LogOut, Home, Settings, CalendarDays, ExternalLink, Receipt, ShoppingCart, TrendingUp, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin/home', label: 'Painel', icon: Home, color: 'text-blue-600' },
    { href: '/admin/expenses', label: 'Despesas', icon: Receipt, color: 'text-red-600' },
    { href: '/admin/sales', label: 'Vendas', icon: ShoppingCart, color: 'text-green-600' },
    { href: '/admin/margins', label: 'Margens', icon: TrendingUp, color: 'text-purple-600' },
]

const moreItems = [
    { href: '/admin/planning', label: 'Planeamento', icon: CalendarDays, color: 'text-orange-600' },
    { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, color: 'text-amber-600' },
    { href: '/admin/settings', label: 'Definições', icon: Settings, color: 'text-gray-600' },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-primary-800/30 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center text-primary-900 font-bold text-lg shadow-lg">
                    P
                </div>
                <div>
                    <span className="font-serif font-bold text-xl text-white block">Admin</span>
                    <span className="text-xs text-beige-300">Gestão Interna</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {[...navItems, ...moreItems].map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20"
                                    : "text-beige-100 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}

                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-beige-100 hover:text-white mt-6 pt-6 border-t border-primary-800/30"
                >
                    <ExternalLink className="w-5 h-5" />
                    <span className="font-medium">Ver Site</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-primary-800/30">
                <form action="/auth/signout" method="post">
                    <Button type="submit" variant="ghost" className="w-full justify-start text-beige-300 hover:text-white hover:bg-white/5 gap-3 py-6 rounded-xl">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-primary-900 via-primary-900 to-primary-950 text-white hidden md:flex flex-col fixed inset-y-0 z-40 shadow-2xl">
                <NavContent />
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
                {/* Main Bottom Nav Bar */}
                <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-200">
                    <nav className="grid grid-cols-5 h-20 px-1">
                        {/* Main Nav Items */}
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
                                        "active:scale-95"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200",
                                        isActive
                                            ? "bg-gradient-to-br from-primary-900 to-primary-800 shadow-lg scale-110"
                                            : "bg-gray-50 hover:bg-gray-100"
                                    )}>
                                        <item.icon className={cn(
                                            "w-6 h-6 transition-colors",
                                            isActive ? "text-white" : item.color
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold transition-colors mt-0.5",
                                        isActive ? "text-primary-900" : "text-gray-500"
                                    )}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="absolute -top-0.5 w-8 h-1 bg-gradient-to-r from-gold to-amber-500 rounded-full" />
                                    )}
                                </Link>
                            )
                        })}

                        {/* More Menu Button */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-all">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
                                        <Menu className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-500">
                                        Mais
                                    </span>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-auto rounded-t-3xl border-t-0">
                                <div className="py-4">
                                    <h3 className="text-lg font-bold text-primary-900 mb-4 px-2">Mais Opções</h3>
                                    <div className="space-y-2">
                                        {moreItems.map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-95",
                                                        isActive
                                                            ? "bg-primary-900 text-white shadow-md"
                                                            : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                                        isActive ? "bg-white/10" : "bg-white"
                                                    )}>
                                                        <item.icon className={cn(
                                                            "w-6 h-6",
                                                            isActive ? "text-white" : item.color
                                                        )} />
                                                    </div>
                                                    <span className="font-semibold text-base">{item.label}</span>
                                                </Link>
                                            )
                                        })}

                                        <Link
                                            href="/"
                                            target="_blank"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 transition-all active:scale-95 border-t border-gray-200 mt-4"
                                        >
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
                                                <ExternalLink className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <span className="font-semibold text-base">Ver Site</span>
                                        </Link>

                                        <form action="/auth/signout" method="post">
                                            <Button
                                                type="submit"
                                                variant="ghost"
                                                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-all w-full justify-start h-auto"
                                            >
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
                                                    <LogOut className="w-6 h-6 text-red-600" />
                                                </div>
                                                <span className="font-semibold text-base">Sair</span>
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </nav>
                </div>
            </div>
        </>
    )
}
