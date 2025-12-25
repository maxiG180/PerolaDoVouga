'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient() as any

    const [settings, setSettings] = useState({
        business_name: '',
        address: '',
        phone: '',
        email: '',
        opening_hours_weekdays: '',
        opening_hours_weekend: '',
        facebook_url: '',
        instagram_url: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('restaurant_settings')
                .select('*')
                .single()

            if (error) throw error

            if (data) {
                setSettings({
                    business_name: data.restaurant_name || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    opening_hours_weekdays: data.opening_hours || '',
                    opening_hours_weekend: data.opening_hours_weekend || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || ''
                })
                // rough parsing if opening_hours is used for both, or just map one. 
                // For this iteration, let's assume opening_hours matches the weekdays input or we need to concat.
                // Let's keep it simple: if the DB has text, put it in weekdays. 
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error('Erro ao carregar definições')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // We need to update the single row. 
            // Since we don't have the ID in state, we can query it or just update all rows (since there's only one generally)
            // or better, fetch the ID first/store it.
            // But 'restaurant_settings' is singleton, so updating where id is not null (or just the one row) is fine.
            // Let's use the policy of updating the single visible row.

            // First get the ID if we don't have it, or just update the first row found.
            const { data: currentSettings } = await supabase.from('restaurant_settings').select('id').single()

            if (!currentSettings) throw new Error('No settings found')

            const updates = {
                restaurant_name: settings.business_name,
                address: settings.address,
                phone: settings.phone,
                email: settings.email,
                opening_hours: settings.opening_hours_weekdays,
                opening_hours_weekend: settings.opening_hours_weekend,
                facebook_url: settings.facebook_url,
                instagram_url: settings.instagram_url,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('restaurant_settings')
                .update(updates)
                .eq('id', currentSettings.id)

            if (error) throw error

            toast.success('Definições guardadas com sucesso')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Erro ao guardar definições')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 shadow-lg mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Definições do Site</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Gerencie as informações gerais do seu negócio.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Nome do Negócio</Label>
                        <Input
                            value={settings.business_name}
                            onChange={e => setSettings({ ...settings, business_name: e.target.value })}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email de Contacto</Label>
                        <Input
                            value={settings.email}
                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                            value={settings.phone}
                            onChange={e => setSettings({ ...settings, phone: e.target.value })}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Morada</Label>
                        <Input
                            value={settings.address}
                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-lg border-b pb-2">Horário de Funcionamento</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Dias de Semana</Label>
                            <Input
                                value={settings.opening_hours_weekdays}
                                onChange={e => setSettings({ ...settings, opening_hours_weekdays: e.target.value })}
                                placeholder="Ex: 08:00 - 20:00"
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fim de Semana</Label>
                            <Input
                                value={settings.opening_hours_weekend}
                                onChange={e => setSettings({ ...settings, opening_hours_weekend: e.target.value })}
                                placeholder="Ex: 09:00 - 22:00"
                                className="h-12"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-lg border-b pb-2">Redes Sociais</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Facebook URL</Label>
                            <Input
                                value={settings.facebook_url}
                                onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                                placeholder="https://facebook.com/..."
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram URL</Label>
                            <Input
                                value={settings.instagram_url}
                                onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                                placeholder="https://instagram.com/..."
                                className="h-12"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="gold" disabled={isSaving} className="w-full md:w-auto gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Alterações
                    </Button>
                </div>
            </form>
        </div>
    )
}
