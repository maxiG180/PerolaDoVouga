import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MenuContent } from '@/components/menu/MenuContent'
import { createClient } from '@/lib/supabase/server'
import { getTodaysMenuData } from '@/services/menuService'

import { useTranslations } from 'next-intl'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getTodaysMenu() {
    return await getTodaysMenuData();
}

export default async function MenuPage() {
    const t = useTranslations('menu')
    const menuData = await getTodaysMenu();
    const supabase = await createClient(true) as any;
    const { data: settings } = await supabase
        .from('restaurant_settings')
        .select('phone')
        .single()

    const phone = (settings as any)?.phone || '+351 21 846 4584'

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl font-bold text-stone-800 mb-4">{t('title')}</h1>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    <MenuContent menuData={menuData} phone={phone} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
