'use client'

import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface RestaurantSettings {
    phone: string
    email: string
    address: string
    restaurant_name: string
    opening_hours: string
    opening_hours_saturday: string
    opening_hours_weekend: string
    facebook_url: string
    instagram_url: string
    show_facebook: boolean
    show_instagram: boolean
}

export function Footer() {
    const [settings, setSettings] = useState<RestaurantSettings | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('restaurant_settings')
                .select('*')
                .single()

            setSettings(data as RestaurantSettings | null)
        }

        fetchSettings()
    }, [])

    // Defaults in case DB is empty or fails
    const phone = settings?.phone || '+351 21 846 4584'
    const email = settings?.email || 'peroladovougalda@gmail.com'
    const address = settings?.address || 'Av. Alm. Reis 243 A, 1000-051 Lisboa'
    const businessName = settings?.restaurant_name || 'Pérola do Vouga'

    // Hours logic: display DB values or fallback
    const hoursWeekday = settings?.opening_hours || '07:00 - 18:00'
    const hoursSaturday = settings?.opening_hours_saturday || '08:00 - 15:00'
    const hoursSunday = settings?.opening_hours_weekend || 'Encerrado'

    // Socials
    const facebookUrl = settings?.facebook_url || 'https://www.facebook.com/share/1JsK9ftJaX/?mibextid=wwXIfr'
    const instagramUrl = settings?.instagram_url || 'https://www.instagram.com/peroladovougaltd'
    const showFacebook = settings?.show_facebook ?? true
    const showInstagram = settings?.show_instagram ?? true

    return (
        <footer className="bg-beige-900 text-beige-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-gold mb-4">{businessName}</h3>
                        <p className="text-beige-300 mb-6 leading-relaxed">
                            Trazemos a elegância e os sabores do Rio Vouga para o coração de Lisboa.
                            Uma experiência gastronómica autêntica e memorável.
                        </p>
                        <div className="flex gap-4">
                            {showFacebook && (
                                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {showInstagram && (
                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-white mb-6">Contactos</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-beige-300">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <span className="whitespace-pre-line">{address}</span>
                            </li>
                            <li className="flex items-center gap-3 text-beige-300">
                                <Phone className="w-5 h-5 text-gold shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-beige-300">
                                <Mail className="w-5 h-5 text-gold shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-white mb-6">Horário</h4>
                        <ul className="space-y-2 text-beige-300">
                            <li className="flex justify-between">
                                <span>Segunda - Sexta</span>
                                <span>{hoursWeekday}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado</span>
                                <span>{hoursSaturday}</span>
                            </li>
                            <li className="flex justify-between text-gold">
                                <span>Domingo</span>
                                <span>{hoursSunday}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-beige-800 pt-8 text-center text-sm text-beige-400">
                    <p>&copy; {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
