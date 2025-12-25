'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UtensilsCrossed, LogOut, Home, Settings, CalendarDays, ExternalLink, Receipt, ShoppingCart, TrendingUp, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const navItems = [
    { href: '/admin/home', label: 'Painel', icon: Home },
    { href: '/admin/expenses', label: 'Despesas', icon: Receipt },
    { href: '/admin/margins', label: 'Margens', icon: TrendingUp },
]


const moreItems = [
    { href: '/admin/settings', label: 'Definições', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const NavContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary-900">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-bold text-lg text-gray-900">Admin</div>
                        <div className="text-xs text-gray-500">Gestão Interna</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {[...navItems, ...moreItems].map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                                isActive
                                    ? "bg-primary-900 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}

                <div className="border-t border-gray-200 my-4 pt-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span>Ver Site</span>
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <form action="/auth/signout" method="post">
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full justify-start gap-3 font-medium"
                    >
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
            <aside className="w-64 hidden md:flex flex-col fixed inset-y-0 z-40">
                <NavContent />
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-white border-t border-gray-300 shadow-lg">
                    <nav className="grid grid-cols-4 h-16">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 transition-colors",
                                        isActive ? "text-primary-900" : "text-gray-500"
                                    )}
                                >
                                    <item.icon className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}

                        {/* More Menu */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button className="flex flex-col items-center justify-center gap-1 text-gray-500">
                                    <Menu className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">Mais</span>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                                <div className="py-4">
                                    <h3 className="text-lg font-bold mb-4">Mais Opções</h3>
                                    <div className="space-y-2">
                                        {moreItems.map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium",
                                                        isActive
                                                            ? "bg-primary-900 text-white"
                                                            : "bg-gray-100 text-gray-900"
                                                    )}
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            )
                                        })}

                                        <Link
                                            href="/"
                                            target="_blank"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium mt-4 border-t pt-4"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            <span>Ver Site</span>
                                        </Link>

                                        <form action="/auth/signout" method="post">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="w-full justify-start gap-3 font-medium mt-2"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                Sair
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
