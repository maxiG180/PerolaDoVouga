import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, UtensilsCrossed, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-primary-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-primary-900 font-bold">
                        P
                    </div>
                    <span className="font-serif font-bold text-lg">Admin Painel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-beige-100 hover:text-white"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Encomendas
                    </Link>
                    <Link
                        href="/admin/menu"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-beige-100 hover:text-white"
                    >
                        <UtensilsCrossed className="w-5 h-5" />
                        Menu & Pratos
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-beige-100 hover:text-white mt-8 border-t border-primary-800"
                    >
                        <Home className="w-5 h-5" />
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
