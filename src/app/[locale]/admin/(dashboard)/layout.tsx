import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

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
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-beige-50">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 pb-28 md:pb-8">
                {children}
            </main>
        </div>
    )
}
