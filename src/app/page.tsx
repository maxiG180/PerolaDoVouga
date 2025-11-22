import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Utensils, Coffee, Star, MapPin, Clock, Phone } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-beige-100">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-beige-100 via-white to-beige-200">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-turquoise/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-beige-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="container relative z-10 px-4 text-center">
                        <div className="inline-block mb-6 animate-fade-in-up">
                            <span className="px-6 py-2 rounded-full border-2 border-gold/40 text-gold-dark text-sm font-semibold tracking-wider uppercase bg-white shadow-lg">
                                ✨ Bem-vindo à Pérola do Vouga
                            </span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-beige-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Sabores que <br />
                            <span className="bg-clip-text bg-gradient-to-r from-gold via-gold-dark to-gold animate-gradient">
                                Encantam
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-beige-800 max-w-3xl mx-auto mb-12 animate-fade-in-up leading-relaxed font-medium" style={{ animationDelay: '0.2s' }}>
                            Uma experiência gastronómica única onde a tradição encontra a elegância.
                            <br className="hidden md:block" />
                            <span className="text-beige-700">Pratos feitos com amor, ingredientes frescos e o toque especial da nossa família.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Link href="/menu">
                                <Button size="lg" variant="gold" className="text-dark w-full sm:w-auto text-lg px-10 py-7 rounded-full shadow-2xl shadow-gold/30 hover:shadow-gold/50 transition-all hover:-translate-y-1 hover:scale-105 font-semibold bg-gold hover:bg-gold-dark">
                                    Ver Menu Completo
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-2 border-beige-400 hover:bg-beige-100 hover:border-gold transition-all hover:scale-105 font-semibold text-beige-900">
                                    A Nossa História
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-beige-900 mb-4">
                                Porque Nos Escolher
                            </h2>
                            <p className="text-beige-700 text-lg max-w-2xl mx-auto">
                                Três razões que fazem da Pérola do Vouga o seu destino gastronómico preferido
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: <Utensils className="w-10 h-10 text-gold" />,
                                    title: "Cozinha Autêntica",
                                    description: "Receitas tradicionais preparadas com um toque moderno e ingredientes locais selecionados com cuidado.",
                                    color: "from-gold/10 to-gold/5"
                                },
                                {
                                    icon: <Coffee className="w-10 h-10 text-turquoise" />,
                                    title: "Ambiente Acolhedor",
                                    description: "Um espaço pensado para o seu conforto, perfeito para momentos especiais com família e amigos.",
                                    color: "from-turquoise/10 to-turquoise/5"
                                },
                                {
                                    icon: <Star className="w-10 h-10 text-gold-dark" />,
                                    title: "Qualidade Premium",
                                    description: "Compromisso absoluto com a excelência em cada prato que servimos, do início ao fim.",
                                    color: "from-beige-200/50 to-beige-100/50"
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-beige-100 border-2 border-beige-300 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-beige-200">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-beige-900 mb-4 text-center">
                                            {feature.title}
                                        </h3>
                                        <p className="text-beige-700 leading-relaxed text-center">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visit Us / Map Section */}
                <section className="py-20 bg-gradient-to-br from-beige-900 via-beige-800 to-beige-700 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold-light font-semibold tracking-widest uppercase mb-6 text-sm">
                                    📍 Visite-nos
                                </span>
                                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                                    Estamos à sua espera
                                </h2>
                                <p className="text-beige-200 text-lg mb-10 leading-relaxed">
                                    Venha conhecer o nosso espaço e desfrutar de uma refeição inesquecível.
                                    Estamos localizados no coração de Lisboa, com fácil acesso.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
                                        <div className="w-14 h-14 rounded-xl bg-gold/30 flex items-center justify-center shrink-0">
                                            <MapPin className="w-7 h-7 text-gold-light" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Morada</h4>
                                            <p className="text-beige-200">
                                                Av. Alm. Reis 243A<br />
                                                1000-058 Lisboa, Portugal
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
                                        <div className="w-14 h-14 rounded-xl bg-turquoise/30 flex items-center justify-center shrink-0">
                                            <Clock className="w-7 h-7 text-turquoise-light" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Horário</h4>
                                            <p className="text-beige-200">
                                                Segunda a Sábado: 07:00 - 18:30<br />
                                                Domingo: Encerrado
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
                                        <div className="w-14 h-14 rounded-xl bg-gold/30 flex items-center justify-center shrink-0">
                                            <Phone className="w-7 h-7 text-gold-light" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Contacto</h4>
                                            <p className="text-beige-200">
                                                +351 123 456 789
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[500px] bg-beige-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3!2d-9.1363!3d38.7305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19347f3b6d3c7b%3A0x8e3e3e3e3e3e3e3e!2sAv.%20Alm.%20Reis%20243A%2C%201000-058%20Lisboa%2C%20Portugal!5e0!3m2!1sen!2spt!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
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
