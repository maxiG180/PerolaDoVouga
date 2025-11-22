import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MenuItem } from '@/components/menu/MenuItem'
import { createClient } from '@/lib/supabase/server'
import { UtensilsCrossed, Soup } from 'lucide-react'

// Force dynamic rendering since we use cookies for Supabase
export const dynamic = 'force-dynamic'

// Mock data for initial display if DB is empty
const MOCK_MENU = [
    {
        id: '1',
        name: 'Tosta Mista Especial',
        description: 'Pão alentejano, queijo da serra, fiambre e orégãos.',
        price: 4.50,
        image_url: null,
        is_available: true,
        category_id: 'sandwiches',
        daily_type: 'none'
    },
    // ... (keep other mock items)
]

export default async function MenuPage() {
    let menuItems = []
    let dailySpecials = { soup: null as any, dish: null as any }

    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .eq('is_available', true)
            .order('display_order', { ascending: true })

        if (data && data.length > 0) {
            menuItems = data.filter((item: any) => item.daily_type === 'none' || !item.daily_type)
            dailySpecials.soup = data.find((item: any) => item.daily_type === 'soup')
            dailySpecials.dish = data.find((item: any) => item.daily_type === 'dish')
        } else {
            menuItems = MOCK_MENU
        }
    } catch (e) {
        console.error('Error fetching menu:', e)
        menuItems = MOCK_MENU
    }

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl font-bold text-primary-900 mb-4">Nosso Menu</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore a nossa seleção de pratos deliciosos, preparados com ingredientes frescos e locais.
                        </p>
                    </div>

                    {/* Daily Specials Section */}
                    {(dailySpecials.soup || dailySpecials.dish) && (
                        <div className="mb-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {dailySpecials.dish && (
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gold/20 relative group">
                                    <div className="absolute top-0 right-0 bg-gold text-white px-4 py-1 rounded-bl-xl font-serif z-10 shadow-sm">
                                        Prato do Dia
                                    </div>
                                    <div className="p-8 flex flex-col items-center text-center h-full">
                                        <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mb-4 text-gold-dark group-hover:scale-110 transition-transform">
                                            <UtensilsCrossed size={32} />
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
                                            {dailySpecials.dish.name}
                                        </h3>
                                        <p className="text-muted-foreground mb-6 flex-grow">
                                            {dailySpecials.dish.description || 'Uma especialidade deliciosa preparada hoje para si.'}
                                        </p>
                                        <div className="text-xl font-bold text-gold-dark mb-4">
                                            {dailySpecials.dish.price.toFixed(2)}€
                                        </div>
                                        <MenuItem item={dailySpecials.dish} />
                                    </div>
                                </div>
                            )}

                            {dailySpecials.soup && (
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-turquoise/20 relative group">
                                    <div className="absolute top-0 right-0 bg-turquoise text-white px-4 py-1 rounded-bl-xl font-serif z-10 shadow-sm">
                                        Sopa do Dia
                                    </div>
                                    <div className="p-8 flex flex-col items-center text-center h-full">
                                        <div className="w-16 h-16 bg-turquoise/10 rounded-full flex items-center justify-center mb-4 text-turquoise-dark group-hover:scale-110 transition-transform">
                                            <Soup size={32} />
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
                                            {dailySpecials.soup.name}
                                        </h3>
                                        <p className="text-muted-foreground mb-6 flex-grow">
                                            {dailySpecials.soup.description || 'Sopa fresca e reconfortante.'}
                                        </p>
                                        <div className="text-xl font-bold text-turquoise-dark mb-4">
                                            {dailySpecials.soup.price.toFixed(2)}€
                                        </div>
                                        <MenuItem item={dailySpecials.soup} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Categories (Simplified for MVP) */}
                    <div className="flex justify-center gap-4 mb-12 overflow-x-auto pb-4">
                        {['Todos', 'Sanduíches', 'Bebidas', 'Pastelaria'].map((cat) => (
                            <button
                                key={cat}
                                className="px-6 py-2 rounded-full bg-white border border-beige-200 hover:border-gold hover:text-gold transition-colors whitespace-nowrap"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuItems.map((item: any) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
