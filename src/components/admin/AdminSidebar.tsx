'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, LogOut, Home, Settings, MessageCircle, CalendarDays, Menu, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin/home', label: 'Painel', icon: Home },
    { href: '/admin/planning', label: 'Planeamento', icon: CalendarDays },
    { href: '/admin/orders', label: 'Encomendas', icon: LayoutDashboard },
    { href: '/admin/menu', label: 'Menu & Pratos', icon: UtensilsCrossed },
    { href: '/admin/chat', label: 'Chat Suporte', icon: MessageCircle },
    { href: '/admin/settings', label: 'Definições', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-primary-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-primary-900 font-bold">
                    P
                </div>
                <span className="font-serif font-bold text-lg text-white">Admin Painel</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary-800 text-white"
                                    : "text-beige-100 hover:bg-primary-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}

                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-beige-100 hover:text-white mt-8 border-t border-primary-800"
                >
                    <ExternalLink className="w-5 h-5" />
                    Ver Site
                </Link>
            </nav>

            <div className="p-4 border-t border-primary-800">
                <form action="/auth/signout" method="post">
                    <Button variant="ghost" className="w-full justify-start text-beige-300 hover:text-white hover:bg-primary-800 gap-3">
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
            <aside className="w-64 bg-primary-900 text-white hidden md:flex flex-col fixed inset-y-0 z-40">
                <NavContent />
            </aside>

            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50 flex items-center justify-between">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-white border-primary-900 text-primary-900">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 bg-primary-900 border-r-primary-800">
                        <NavContent />
                    </SheetContent>
                </Sheet>
                <span className="font-serif font-bold text-lg text-primary-900">Admin</span>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>
        </>
    )
}
