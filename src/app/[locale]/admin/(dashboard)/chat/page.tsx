import { AdminChatInterface } from '@/components/admin/AdminChatInterface'

export const dynamic = 'force-dynamic'

export default function ChatPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-900">Suporte ao Cliente</h1>
            </div>
            <AdminChatInterface />
        </div>
    )
}
