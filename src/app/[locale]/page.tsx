import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, Star, MapPin, Clock, Phone, ChefHat } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
    const t = await getTranslations('home')
    const tCommon = await getTranslations('common')
    const locale = await getLocale()

    // Fetch contact settings from database
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single()

    const phone = (settings as any)?.phone || '+351 21 846 4584'
    const email = (settings as any)?.email || 'peroladovougalda@gmail.com'
    const address = (settings as any)?.address || 'Av. Alm. Reis 243 A, 1000-051 Lisboa'
    const hours = (settings as any)?.opening_hours || '07:00 - 19:00'
    const hoursWeekend = (settings as any)?.opening_hours_weekend || '08:00 - 13:00'






    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <LocalBusinessSchema />
            <Header />

            <main className="flex-1">
                {/* Hero Section - Redesigned for Mobile First */}
                {/* Hero Section - Light & Airy Split Layout */}
                <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-beige-100/50 -z-10 rounded-l-[100px] hidden lg:block" />
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />

                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            {/* Left Content */}
                            <div className="lg:w-1/2 text-center lg:text-left space-y-8">
                                <div className="inline-block animate-fade-in-up">
                                    <span className="px-4 py-1.5 rounded-lg bg-beige-100 text-beige-900 text-sm font-medium">
                                        {t('welcome')}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-stone-800 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    {t('tagline')}
                                </h1>

                                <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    {locale === 'pt'
                                        ? 'Trazemos a elegância e os sabores do Rio Vouga para o coração de Lisboa. Uma experiência gastronómica autêntica e memorável.'
                                        : 'We bring the elegance and flavors of the Vouga River to the heart of Lisbon. An authentic and memorable dining experience.'}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    {/* <Button asChild size="lg" className="bg-stone-800 text-white hover:bg-stone-900">
                                        <Link href="/menu">
                                            {t('cta_menu')}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button> */}
                                    <Button asChild variant="outline" size="lg" className="border-stone-300 text-stone-800 hover:bg-stone-50">
                                        <Link href="/about">
                                            {t('cta_about')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                {/* Main Dish Image */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[350px] lg:h-[500px] z-10 w-full transform hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        src="/Bacalhau-com-natas.jpg"
                                        alt="Bacalhau com Natas - Nossa Especialidade"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Badge */}
                                    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-stone-100 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-gold fill-current" />
                                        <span className="font-serif font-bold text-stone-800 text-lg">{locale === 'pt' ? 'Bacalhau com Natas' : 'Codfish with Cream'}</span>
                                    </div>
                                </div>

                                {/* Floating Cafe Image (Inset) */}
                                <div className="absolute -top-6 -right-6 w-32 h-24 lg:w-48 lg:h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20 hidden md:block group cursor-pointer">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    <img
                                        src="/cafe.jpg"
                                        alt="Nosso Espaço"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Online Ordering Coming Soon Banner */}
                <section className="bg-stone-900 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <Badge className="bg-gold text-white mb-4 hover:bg-gold text-lg py-1 px-4">{locale === 'pt' ? 'Em Breve' : 'Coming Soon'}</Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                            {locale === 'pt' ? 'Encomendas Online' : 'Online Ordering'}
                        </h2>
                        <p className="text-stone-300 text-lg max-w-2xl mx-auto">
                            {locale === 'pt'
                                ? 'Estamos a preparar o nosso sistema de encomendas online para que possa desfrutar dos nossos pratos no conforto da sua casa. Fique atento!'
                                : 'We are preparing our online ordering system so you can enjoy our dishes in the comfort of your home. Stay tuned!'}
                        </p>
                    </div>
                </section>

                {/* All Menu Items - Compact & Organized */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
                                {t('featured_title')}
                            </h2>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                {locale === 'pt'
                                    ? 'Descubra a nossa seleção completa de pratos tradicionais portugueses'
                                    : 'Discover our complete selection of traditional Portuguese dishes'}
                            </p>
                        </div>


                        <div className="space-y-16">
                            {/* PEIXE */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xl shadow-lg border border-blue-400/30">
                                        {locale === 'pt' ? 'Peixe' : 'Fish'}
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Bacalhau-com-natas.jpg" alt="Bacalhau com Natas" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Badge className="bg-gold text-white mb-3 hover:bg-gold-dark border-none shadow-sm">{locale === 'pt' ? 'Prato do Dia' : 'Dish of the Day'}</Badge>
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Bacalhau com Natas' : 'Codfish with Cream'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Cremoso e gratinado na perfeição' : 'Creamy and perfectly gratinated'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Chocos à lagareiro.jpeg" alt="Chocos à Lagareiro" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Chocos à Lagareiro' : 'Cuttlefish Lagareiro'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Com azeite e batatas assadas' : 'With olive oil and roasted potatoes'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Salmao grelhado.jpeg" alt="Salmão Grelhado" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Salmão Grelhado' : 'Grilled Salmon'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Fresco e saudável' : 'Fresh and healthy'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Omelete de Camarao.jpeg" alt="Omelete de Camarão" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Omelete de Camarão' : 'Shrimp Omelette'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Leve e saborosa' : 'Light and tasty'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Rolos de espinafre e salmao fumado.jpeg" alt="Rolos de Espinafre" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Rolos de Espinafre' : 'Spinach Rolls'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Com salmão fumado' : 'With smoked salmon'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-2 pr-4">
                                    <span className="font-serif italic text-stone-500 text-lg">
                                        {locale === 'pt' ? '...e muito mais!' : '...and much more!'}
                                    </span>
                                </div>
                            </div>

                            {/* CARNE */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xl shadow-lg border border-red-400/30">
                                        {locale === 'pt' ? 'Carne' : 'Meat'}
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-red-200 to-transparent"></div>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Perna de peru assada no forno.jpeg" alt="Perna de Peru" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Badge className="bg-primary-900 text-white mb-3 hover:bg-primary-800 border-none shadow-sm">{locale === 'pt' ? 'Recomendado' : 'Recommended'}</Badge>
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Perna de Peru' : 'Turkey Leg'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Assada no forno, suculenta' : 'Oven roasted, succulent'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Strogonoff de vitela.jpeg" alt="Strogonoff" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Strogonoff' : 'Beef Stroganoff'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Cremoso e delicioso' : 'Creamy and delicious'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Lombo de porco recheado com fartinheira e pure de batata.jpeg" alt="Lombo de Porco" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Lombo Recheado' : 'Stuffed Loin'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Com farinheira e puré' : 'With sausage and puree'}</p>
                                        </div>
                                    </div>
                                    <div className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                        <img src="/Moamba de Galinha.jpeg" alt="Moamba de Galinha" className="w-full h-full object-cover transform group-hover:scale-100 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-serif text-3xl font-bold mb-2 drop-shadow-md">{locale === 'pt' ? 'Moamba de Galinha' : 'Chicken Moamba'}</h3>
                                            <p className="text-white/90 font-medium">{locale === 'pt' ? 'Sabor tradicional de Angola' : 'Traditional Angolan flavor'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-2 pr-4">
                                    <span className="font-serif italic text-stone-500 text-lg">
                                        {locale === 'pt' ? '...e muito mais!' : '...and much more!'}
                                    </span>
                                </div>
                            </div>

                            {/* SOBREMESAS */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold text-xl shadow-lg border border-pink-400/30">
                                        {locale === 'pt' ? 'Sobremesas & Pães' : 'Desserts & Breads'}
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-200 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Bolachas.jpeg" alt="Bolachinhas de Natal" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Bolachinhas' : 'Cookies'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Bolo de sementes de papoila.jpeg" alt="Bolo de Sementes" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Bolo Sementes' : 'Seed Cake'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Pao com chourico.jpeg" alt="Pão com Chouriço" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Pão c/ Chouriço' : 'Chorizo Bread'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Pao de leite.jpeg" alt="Pão de Leite" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Pão de Leite' : 'Milk Bread'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Mousse de chocolate.jpeg" alt="Mousse de Chocolate" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Mousse Choc.' : 'Choc. Mousse'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Arroz doce.jpeg" alt="Arroz Doce" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Arroz Doce' : 'Sweet Rice'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Rabanadas.jpeg" alt="Rabanadas" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Rabanadas' : 'French Toast'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Baba de camelo.jpeg" alt="Baba de Camelo" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Baba de Camelo' : 'Caramel Mousse'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Sonhios.jpeg" alt="Sonhos" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Sonhos' : 'Puffs'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Folhado de salsicha.jpeg" alt="Folhado de Salsicha" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Folhado' : 'Sausage Puff'}</h3>
                                        </div>
                                    </div>
                                    <div className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ring-1 ring-black/5">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10"></div>
                                        <img src="/Gelatina tricolor.jpeg" alt="Gelatina Tricolor" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{locale === 'pt' ? 'Gelatina' : 'Jelly'}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* And Much More & Notice */}
                            <div className="mt-20 text-center">
                                <h3 className="text-2xl md:text-3xl font-serif text-stone-600 mb-8 italic">
                                    {locale === 'pt' ? '...e muito mais para descobrir!' : '...and much more to discover!'}
                                </h3>

                                <div className="max-w-2xl mx-auto bg-stone-50 rounded-2xl p-8 border border-stone-200 shadow-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-3 bg-stone-200 rounded-full">
                                            <Clock className="w-6 h-6 text-stone-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-stone-800 mb-2">
                                                {locale === 'pt' ? 'Nota Importante' : 'Important Notice'}
                                            </h4>
                                            <p className="text-stone-600 leading-relaxed mb-4">
                                                {locale === 'pt'
                                                    ? 'Nem todos os pratos estão disponíveis todos os dias. Alguns produtos podem exigir encomenda prévia.'
                                                    : 'Not all dishes are available every day. Some items may require pre-ordering.'}
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-stone-800">
                                                <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                                                    <Phone className="w-4 h-4" /> {phone}
                                                </a>
                                                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                                                    <span>✉️</span> {email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>



                {/* Visit Us / Map Section */}
                <section className="py-20 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold-dark font-semibold tracking-widest uppercase mb-6 text-sm">
                                    📍 {t('visit_us')}
                                </span>
                                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-primary-900">
                                    {t('waiting_for_you')}
                                </h2>
                                <p className="text-stone-600 text-lg mb-10 leading-relaxed">
                                    {t('visit_description')}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-gold/30 hover:shadow-lg transition-all">
                                        <MapPin className="w-8 h-8 text-gold mb-4" />
                                        <h4 className="font-bold text-lg mb-2 text-primary-900">{tCommon('address')}</h4>
                                        <p className="text-stone-600 text-sm">
                                            {address}
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-gold/30 hover:shadow-lg transition-all">
                                        <Clock className="w-8 h-8 text-gold mb-4" />
                                        <h4 className="font-bold text-lg mb-2 text-primary-900">{tCommon('hours')}</h4>
                                        <p className="text-stone-600 text-sm">
                                            Seg-Sex: 07:00 - 18:00<br />
                                            Sáb: 08:00 - 15:00<br />
                                            Dom: {locale === 'pt' ? 'Encerrado' : 'Closed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] lg:h-[500px] bg-stone-100 rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative group">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3!2d-9.1363!3d38.7305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19347f3b6d3c7b%3A0x8e3e3e3e3e3e3e3e!2sAv.%20Alm.%20Reis%20243%20A%2C%201000-051%20Lisboa%2C%20Portugal!5e0!3m2!1sen!2spt!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="grayscale-[0%] transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>


            </main>

            <Footer />
        </div>
    )
}
