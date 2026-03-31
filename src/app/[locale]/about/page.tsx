import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import { getLocale } from 'next-intl/server'

export default async function AboutPage() {
    const locale = await getLocale()

    return (
        <div className="min-h-screen flex flex-col bg-beige-100/30">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                            {locale === 'pt' ? 'A Nossa História' : 'Our History'}
                        </h1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl border-8 border-white">
                            <img
                                src="/cafe.jpg"
                                alt="Nosso Espaço Acolhedor"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
                                {locale === 'pt' ? 'Tradição e Família' : 'Tradition and Family'}
                            </h2>
                            <p className="text-lg text-stone-600 leading-relaxed font-medium">
                                {locale === 'pt'
                                    ? 'A Pérola do Vouga nasceu com um propósito simples: servir comida real num ambiente onde todos se sentem em casa.'
                                    : 'Pérola do Vouga was born with a simple purpose: to serve real food in an environment where everyone feels at home.'}
                            </p>
                            <p className="text-lg text-stone-600 leading-relaxed">
                                {locale === 'pt'
                                    ? 'Com anos de dedicação, o nosso espaço tornou-se um ponto de encontro para quem valoriza a hospitalidade genuína e o sabor da cozinha caseira.'
                                    : 'With years of dedication, our space has become a meeting point for those who value genuine hospitality and the taste of home-cooked food.'}
                            </p>
                            <p className="text-lg text-stone-600 leading-relaxed">
                                {locale === 'pt'
                                    ? <>A nossa cozinha é uma celebração de culturas. Servimos a tradicional <strong>cozinha portuguesa</strong>, enriquecida com o tempero da <strong>cozinha africana</strong> e toques da <strong>cozinha ucraniana</strong>, honrando as diversas raízes da nossa equipa.</>
                                    : <>Our kitchen is a celebration of cultures. We serve traditional <strong>Portuguese cuisine</strong>, enriched with <strong>African seasoning</strong> and touches of <strong>Ukrainian cuisine</strong>, honoring the diverse roots of our team.</>}
                            </p>
                            <p className="text-lg text-stone-600 leading-relaxed italic">
                                {locale === 'pt'
                                    ? '“O nome Pérola reflete o carinho que colocamos em cada detalhe, em cada prato e em cada sorriso que partilhamos consigo.”'
                                    : '“The name Pérola reflects the care we put into every detail, every dish, and every smile we share with you.”'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 mb-8">
                            {locale === 'pt' ? 'Os Nossos Valores' : 'Our Values'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-xl">
                                    🌾
                                </div>
                                <h3 className="font-semibold text-lg text-stone-800">{locale === 'pt' ? 'Tradição' : 'Tradition'}</h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'pt'
                                        ? 'Respeitamos as receitas antigas e os métodos tradicionais de confecção.'
                                        : 'We respect ancient recipes and traditional cooking methods.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-xl">
                                    🤝
                                </div>
                                <h3 className="font-semibold text-lg text-stone-800">{locale === 'pt' ? 'Família' : 'Family'}</h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'pt'
                                        ? 'Somos uma empresa familiar e estendemos esse sentimento a quem nos visita.'
                                        : 'We are a family business and extend this feeling to everyone who visits us.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-xl">
                                    ✨
                                </div>
                                <h3 className="font-semibold text-lg text-stone-800">{locale === 'pt' ? 'Qualidade' : 'Quality'}</h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'pt'
                                        ? 'Não comprometemos a qualidade dos nossos ingredientes. Fresco é sempre melhor.'
                                        : 'We do not compromise on the quality of our ingredients. Fresh is always better.'}
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
