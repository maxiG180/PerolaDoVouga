'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const t = useTranslations('admin.login')

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsLoggedIn(true)
            }
        }
        checkSession()
    }, [supabase])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast.success(t('success'))
            router.refresh()
            router.push('/admin/orders')
        } catch (error: any) {
            toast.error(t('error'))
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setIsLoggedIn(false)
        router.refresh()
    }

    if (isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-beige-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold/20 text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Pérola do Vouga"
                            width={100}
                            height={100}
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-primary-900 mb-2">{t('title')}</h1>
                    <p className="text-muted-foreground mb-6">Você já está autenticado.</p>

                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            variant="gold"
                            onClick={() => router.push('/admin/orders')}
                        >
                            Ir para Painel de Controlo
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleLogout}
                        >
                            Terminar Sessão
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-beige-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Pérola do Vouga"
                            width={100}
                            height={100}
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-primary-900">{t('title')}</h1>
                    <p className="text-muted-foreground text-sm mt-2">{t('subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('email_label')}</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@peroladovouga.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('password_label')}</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" variant="gold" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {t('submit_button')}
                    </Button>
                </form>
            </div>
        </div>
    )
}
