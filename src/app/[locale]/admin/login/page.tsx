'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast.success('Login efetuado com sucesso!')
            router.push('/admin/orders')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-beige-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-beige-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-gold/30">
                        🦪
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-primary-900">Área de Administração</h1>
                    <p className="text-muted-foreground text-sm mt-2">Pérola do Vouga</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@peroladovouga.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
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
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    )
}
