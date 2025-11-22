import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-beige-900 text-beige-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-gold mb-4">Pérola do Vouga</h3>
                        <p className="text-beige-300 mb-6 leading-relaxed">
                            Trazendo a elegância e os sabores do Rio Vouga para o coração de Lisboa.
                            Uma experiência gastronómica autêntica e memorável.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-white mb-6">Contactos</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-beige-300">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <span>Rua da Pérola, 123<br />1000-001 Lisboa, Portugal</span>
                            </li>
                            <li className="flex items-center gap-3 text-beige-300">
                                <Phone className="w-5 h-5 text-gold shrink-0" />
                                <span>+351 21 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-beige-300">
                                <Mail className="w-5 h-5 text-gold shrink-0" />
                                <span>peroladovougalda@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-white mb-6">Horário</h4>
                        <ul className="space-y-2 text-beige-300">
                            <li className="flex justify-between">
                                <span>Segunda - Sexta</span>
                                <span>08:00 - 20:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado</span>
                                <span>09:00 - 21:00</span>
                            </li>
                            <li className="flex justify-between text-gold">
                                <span>Domingo</span>
                                <span>Fechado</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-beige-800 pt-8 text-center text-sm text-beige-400">
                    <p>&copy; {new Date().getFullYear()} Pérola do Vouga. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
