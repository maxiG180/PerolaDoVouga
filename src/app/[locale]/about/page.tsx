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

                    <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
                        <div className="relative h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
                            <img
                                src="/vouga.jpg"
                                alt="Rio Vouga"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
                                {locale === 'pt' ? 'Do Rio Vouga para Lisboa' : 'From the Vouga River to Lisbon'}
                            </h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {locale === 'pt'
                                    ? 'A Pérola do Vouga nasceu de um sonho familiar: trazer os sabores autênticos e a hospitalidade calorosa da região do Vouga para o coração da capital.'
                                    : 'Pérola do Vouga was born from a family dream: to bring the authentic flavors and warm hospitality of the Vouga region to the heart of the capital.'}
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {locale === 'pt'
                                    ? 'Com muitos anos de história, este espaço sempre foi mais do que um café ou restaurante. É um ponto de encontro, uma extensão da nossa sala de estar, onde cada cliente é tratado como família.'
                                    : 'With many years of history, this space has always been more than just a café or restaurant. It is a meeting point, an extension of our living room, where every customer is treated like family.'}
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {locale === 'pt'
                                    ? <>A nossa cozinha é uma celebração de culturas. Servimos a tradicional <strong>cozinha portuguesa</strong>, enriquecida com o tempero da <strong>cozinha africana</strong> pelas mãos da nossa cozinheira, e com sabores da <strong>cozinha de leste (ucraniana)</strong>, honrando as origens dos nossos proprietários.</>
                                    : <>Our kitchen is a celebration of cultures. We serve traditional <strong>Portuguese cuisine</strong>, enriched with the seasoning of <strong>African cuisine</strong> by the hands of our cook, and with flavors of <strong>Eastern European cuisine (Ukrainian)</strong>, honoring the origins of our owners.</>}
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {locale === 'pt'
                                    ? 'O nome "Pérola" reflete o cuidado que dedicamos a cada prato, a cada café, a cada sorriso que partilhamos convosco.'
                                    : 'The name "Pérola" (Pearl) reflects the care we dedicate to every dish, every coffee, and every smile we share with you.'}
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
