import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
                            A Nossa História
                        </h1>
                        <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                            {/* Placeholder for About Image - In real app use actual image */}
                            <div className="absolute inset-0 bg-beige-200 flex items-center justify-center">
                                <span className="text-4xl">📸</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl font-bold text-primary-900">
                                Do Rio Vouga para Lisboa
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                A Pérola do Vouga nasceu de um sonho familiar: trazer os sabores autênticos e a hospitalidade calorosa da região do Vouga para o coração da capital.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Fundada em 1995 pelos nossos pais, este espaço sempre foi mais do que um café ou restaurante. É um ponto de encontro, uma extensão da nossa sala de estar, onde cada cliente é tratado como família.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                O nome "Pérola" não é coincidência. Tal como uma pérola se forma com tempo e cuidado, também nós dedicamos tempo a cada prato, a cada café, a cada sorriso que partilhamos convosco.
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="bg-white rounded-3xl p-12 shadow-lg border border-beige-200 mb-24">
                        <h2 className="font-serif text-3xl font-bold text-center text-primary-900 mb-12">
                            Os Nossos Valores
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-2xl">
                                    🌾
                                </div>
                                <h3 className="font-bold text-xl">Tradição</h3>
                                <p className="text-muted-foreground">
                                    Respeitamos as receitas antigas e os métodos tradicionais de confecção.
                                </p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-2xl">
                                    🤝
                                </div>
                                <h3 className="font-bold text-xl">Família</h3>
                                <p className="text-muted-foreground">
                                    Somos uma empresa familiar e estendemos esse sentimento a quem nos visita.
                                </p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-2xl">
                                    ✨
                                </div>
                                <h3 className="font-bold text-xl">Qualidade</h3>
                                <p className="text-muted-foreground">
                                    Não comprometemos a qualidade dos nossos ingredientes. Fresco é sempre melhor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
