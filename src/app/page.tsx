import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, Star, MapPin, Clock } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-beige-100">
                    <div className="absolute inset-0 bg-[url('/img/hero-pattern.png')] opacity-5"></div>

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="container relative z-10 px-4 text-center">
                        <div className="inline-block mb-6 animate-fade-in-up">
                            <span className="px-4 py-1.5 rounded-full border border-gold/50 text-gold-dark text-sm font-medium tracking-wider uppercase bg-white/50 backdrop-blur-sm">
                                Bem-vindo à Pérola do Vouga
                            </span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary-900 mb-8 leading-tight animate-fade-in-up delay-100">
                            Sabores que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">Encantam</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed">
                            Uma experiência gastronómica única onde a tradição encontra a elegância.
                            Pratos feitos com amor, ingredientes frescos e o toque especial da nossa família.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                            <Link href="/menu">
                                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-xl shadow-gold/20 hover:shadow-gold/30 transition-all hover:-translate-y-1">
                                    Ver Menu
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 hover:bg-beige-100">
                                    Sobre Nós
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: <Utensils className="w-8 h-8 text-gold" />,
                                    title: "Cozinha Autêntica",
                                    description: "Receitas tradicionais preparadas com um toque moderno e ingredientes locais selecionados."
                                },
                                {
                                    icon: <Coffee className="w-8 h-8 text-gold" />,
                                    title: "Ambiente Acolhedor",
                                    description: "Um espaço pensado para o seu conforto, perfeito para momentos especiais."
                                },
                                {
                                    icon: <Star className="w-8 h-8 text-gold" />,
                                    title: "Qualidade Premium",
                                    description: "Compromisso absoluto com a qualidade em cada prato que servimos."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-8 rounded-2xl bg-beige-50 hover:bg-beige-100 transition-colors duration-300 group">
                                    <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-primary-900 mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visit Us / Map Section */}
                <section className="py-24 bg-beige-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/img/pattern-dark.png')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="text-gold font-medium tracking-widest uppercase mb-4 block">Visite-nos</span>
                                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Estamos à sua espera</h2>
                                <p className="text-beige-300 text-lg mb-8 leading-relaxed">
                                    Venha conhecer o nosso espaço e desfrutar de uma refeição inesquecível.
                                    Estamos localizados no coração da cidade, com fácil acesso e estacionamento.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Morada</h4>
                                            <p className="text-beige-300">Rua da Pérola, 123<br />1000-001 Lisboa, Portugal</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Horário</h4>
                                            <p className="text-beige-300">Seg - Sex: 08:00 - 20:00<br />Sáb: 09:00 - 21:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] bg-beige-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                                {/* Map Placeholder - In a real app, use Google Maps Embed API */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.9347776187656!2d-9.139336584655366!3d38.72225237959807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd193381e8b1c7c1%3A0x32622963791369!2sLisbon%2C%20Portugal!5e0!3m2!1sen!2sus!4v1645564756276!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="grayscale group-hover:grayscale-0 transition-all duration-500"
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
