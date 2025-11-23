import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, Star, MapPin, Clock, Phone, ChefHat } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
    const t = await getTranslations('home')
    const tCommon = await getTranslations('common')

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section - Redesigned for Mobile First */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/70 z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 z-10"></div>
                        <img
                            src="/img_homepage/salmao grelhado.jpg"
                            alt="Background"
                            className="w-full h-full object-cover scale-105 animate-slow-zoom"
                        />
                    </div>

                    <div className="container relative z-20 px-4 mt-16">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="lg:w-1/2 text-center lg:text-left">
                                <div className="inline-block mb-6 animate-fade-in-up">
                                    <span className="px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm font-semibold tracking-wider uppercase shadow-lg">
                                        ✨ {t('welcome')}
                                    </span>
                                </div>

                                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in-up drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
                                    <span className="text-white">{t('tagline').split(' ')[0]}</span> <br />
                                    <span className="text-white">
                                        {t('tagline').split(' ').slice(1).join(' ')}
                                    </span>
                                </h1>

                                <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in-up leading-relaxed font-medium drop-shadow-md" style={{ animationDelay: '0.2s' }}>
                                    {t('description')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-stone-100 w-full sm:w-auto text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1 hover:scale-105 font-bold border-none">
                                        <Link href="/menu">
                                            {t('cta_menu')}
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary-900 transition-all hover:scale-105 font-bold backdrop-blur-sm shadow-lg">
                                        <Link href="/about">
                                            {t('cta_about')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:w-1/2 relative mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="relative max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-all duration-500 group">
                                    <div className="absolute -inset-4 bg-white/10 backdrop-blur-md rounded-3xl -z-10 group-hover:bg-white/20 transition-colors"></div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 relative aspect-[4/3]">
                                        <img
                                            src="/vouga.jpg"
                                            alt="Rio Vouga"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
                                            <p className="text-white font-serif italic text-xl font-bold">"As nossas origens: Rio Vouga"</p>
                                            <p className="text-white/90 text-sm mt-1 font-medium">A inspiração por trás de cada prato.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Dishes Section - Redesigned Grid */}
                <section className="py-20 bg-white relative">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div className="text-left">
                                <span className="text-gold font-serif italic text-xl mb-2 block">{t('featured_subtitle')}</span>
                                <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900">
                                    {t('featured_title')}
                                </h2>
                            </div>
                            <Button asChild variant="ghost" className="text-primary-900 hover:text-gold hover:bg-transparent gap-2 group text-lg">
                                <Link href="/menu">
                                    Ver Menu Completo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Dish 1 */}
                            <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <img
                                    src="/img_homepage/Bacalhau-com-natas.jpg"
                                    alt="Bacalhau com Natas"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <Badge className="bg-gold text-white mb-3 hover:bg-gold">Prato do Dia</Badge>
                                    <h3 className="text-white font-serif text-3xl font-bold mb-2">Bacalhau com Natas</h3>
                                    <p className="text-white/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                        O clássico português, cremoso e gratinado na perfeição.
                                    </p>
                                </div>
                            </div>

                            {/* Dish 2 */}
                            <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <img
                                    src="/img_homepage/bitoque-de-vaca.jpg"
                                    alt="Bitoque de Novilho"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <Badge className="bg-primary-900 text-white mb-3 hover:bg-primary-800">Recomendado</Badge>
                                    <h3 className="text-white font-serif text-3xl font-bold mb-2">Bitoque de Novilho</h3>
                                    <p className="text-white/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                        Suculento bife com ovo, batata frita e o nosso molho especial.
                                    </p>
                                </div>
                            </div>

                            {/* Dish 3 */}
                            <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <img
                                    src="/img_homepage/secretos-de-porco.jpg"
                                    alt="Secretos de Porco"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <Badge className="bg-accent text-white mb-3 hover:bg-accent">Grelhados</Badge>
                                    <h3 className="text-white font-serif text-3xl font-bold mb-2">Secretos de Porco</h3>
                                    <p className="text-white/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                        Grelhados no ponto, tenros e cheios de sabor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Cleaner Look */}
                <section className="py-12 bg-stone-50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: <ChefHat className="w-8 h-8 text-gold" />,
                                    title: t('features.authentic.title'),
                                    description: t('features.authentic.description'),
                                },
                                {
                                    icon: <Coffee className="w-8 h-8 text-gold" />,
                                    title: t('features.cozy.title'),
                                    description: t('features.cozy.description'),
                                },
                                {
                                    icon: <Star className="w-8 h-8 text-gold" />,
                                    title: t('features.quality.title'),
                                    description: t('features.quality.description'),
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-8 rounded-2xl bg-white border border-stone-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-16 h-16 mb-6 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-primary-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
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
                                            Av. Alm. Reis 243A<br />
                                            1000-058 Lisboa
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-gold/30 hover:shadow-lg transition-all">
                                        <Clock className="w-8 h-8 text-gold mb-4" />
                                        <h4 className="font-bold text-lg mb-2 text-primary-900">{tCommon('hours')}</h4>
                                        <p className="text-stone-600 text-sm">
                                            Seg-Sáb: 07:00 - 18:30<br />
                                            Domingo: Encerrado
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] lg:h-[500px] bg-stone-100 rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative group">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3!2d-9.1363!3d38.7305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19347f3b6d3c7b%3A0x8e3e3e3e3e3e3e3e!2sAv.%20Alm.%20Reis%20243A%2C%201000-058%20Lisboa%2C%20Portugal!5e0!3m2!1sen!2spt!4v1234567890"
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
