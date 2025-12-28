import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, Star, MapPin, Clock, Phone, ChefHat } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
    const t = await getTranslations('home')
    const tCommon = await getTranslations('common')

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
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
                                    {t('description')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    <Button asChild size="lg" className="bg-stone-800 text-white hover:bg-stone-900">
                                        <Link href="/menu">
                                            {t('cta_menu')}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="border-stone-300 text-stone-800 hover:bg-stone-50">
                                        <Link href="/about">
                                            {t('cta_about')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 h-[350px] lg:h-[500px]">
                                    <img
                                        src="/cafe.jpg"
                                        alt="Pérola do Vouga - Pastelaria & Snack-Bar"
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
                        <Badge className="bg-gold text-white mb-4 hover:bg-gold text-lg py-1 px-4">Em Breve</Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                            Encomendas Online
                        </h2>
                        <p className="text-stone-300 text-lg max-w-2xl mx-auto">
                            Estamos a preparar o nosso sistema de encomendas online para que possa desfrutar dos nossos pratos no conforto da sua casa. Fique atento!
                        </p>
                    </div>
                </section>

                {/* Featured Dishes Section - Redesigned Grid */}
                <section className="py-20 bg-white relative">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                            <div className="text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
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
                                    src="/Bacalhau-com-natas.jpg"
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
                                    src="/bitoque-de-vaca.jpg"
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
                                    src="/secretos-de-porco.jpg"
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
                                            Av. Alm. Reis 243 A<br />
                                            1000-051 Lisboa
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
