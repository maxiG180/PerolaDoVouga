import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Clock, EnvelopeSimple as Mail } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'

import { getTranslations } from 'next-intl/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Remove getTodaysMenu

export default async function MenuPage() {
    const t = await getTranslations('menu')
    const supabase = await createClient(true) as any;
    const { data: settings } = await supabase
        .from('restaurant_settings')
        .select('email')
        .single()

    const email = (settings as any)?.email || 'peroladovougalda@gmail.com'

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl font-bold text-stone-800 mb-4">{t('title')}</h1>
                        <p className="text-stone-600 max-w-2xl mx-auto mb-12">
                            {t('subtitle')}
                        </p>

                        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border border-stone-200 shadow-xl text-center space-y-6">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-gold" />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-800">
                                {t('maintenance_title')}
                            </h2>
                            <p className="text-stone-600 text-lg leading-relaxed max-w-md mx-auto">
                                {t('maintenance_desc')}
                            </p>
                            <a 
                                href={`mailto:${email}`}
                                className="inline-flex items-center gap-2 text-xl font-bold text-gold hover:text-gold-dark transition-colors"
                            >
                                <Mail className="w-6 h-6" />
                                {email}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
