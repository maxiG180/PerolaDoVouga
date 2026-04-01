'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
    Soup, 
    Fish, 
    Utensils, 
    ChefHat, 
    Coffee, 
    Cake, 
    Wine, 
    Beer, 
    Pizza,
    Microwave // For Ukrainian/Traditional items
} from 'lucide-react'

interface PremiumPlaceholderProps {
    name: string
    className?: string
}

export function PremiumPlaceholder({ name, className }: PremiumPlaceholderProps) {
    const lowerName = name.toLowerCase()
    
    // Icon & Gradient Logic based on Name
    let Icon = Utensils
    let gradientClass = "from-[#F5F1E6] via-[#E8E0CC] to-[#D4AF37]/20" // Default Beige/Gold
    let iconColor = "text-gold-dark"
    let emoji = ""

    if (lowerName.includes('sopa')) {
        Icon = Soup
        gradientClass = "from-[#FAF7F0] via-[#F2EAD3] to-[#D4AF37]/30"
    } else if (lowerName.includes('peixe') || lowerName.includes('salmão') || lowerName.includes('bacalhau') || lowerName.includes('pescada') || lowerName.includes('dourada')) {
        Icon = Fish
        gradientClass = "from-[#F0F4F8] via-[#D1E1F0] to-[#D4AF37]/20" // Hint of blue but stays in palette
    } else if (lowerName.includes('carne') || lowerName.includes('bife') || lowerName.includes('picanha') || lowerName.includes('frango') || lowerName.includes('peru')) {
        Icon = ChefHat
        gradientClass = "from-[#F9F6F0] via-[#EDE6D6] to-[#D4AF37]/40"
    } else if (lowerName.includes('sobremesa') || lowerName.includes('doce') || lowerName.includes('bolo')) {
        Icon = Cake
        gradientClass = "from-[#FFF9F2] via-[#FCEAD5] to-[#D4AF37]/25"
    } else if (lowerName.includes('café') || lowerName.includes('bebida') || lowerName.includes('sumo')) {
        Icon = Coffee
    }

    // Special Ukrainian highlight
    const isUkrainian = lowerName.includes('ucrania') || lowerName.includes('ucrânia')

    return (
        <div className={cn(
            "relative w-full h-full overflow-hidden flex flex-col items-center justify-center transition-all duration-700 bg-gradient-to-br",
            gradientClass,
            className
        )}>
            {/* Elegant Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Floating Icon/Logo Wrapper */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full scale-150 opacity-50" />
                    <div className="relative bg-white/40 backdrop-blur-md p-5 rounded-full border border-white/50 shadow-xl">
                        <Icon className={cn("w-12 h-12", iconColor)} strokeWidth={1.5} />
                    </div>
                </div>

                {isUkrainian && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 px-3 py-1 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-full flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Specialty</span>
                        <span className="text-sm">🇺🇦</span>
                    </motion.div>
                )}
            </motion.div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border border-gold/10 rounded-full" />
            <div className="absolute bottom-8 right-8 w-20 h-20 border border-gold/5 rounded-full" />
            
            {/* Subtle Brand Text */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[9px] uppercase tracking-[0.4em] text-beige-400 font-bold opacity-60">
                    Pérola do Vouga
                </span>
            </div>
        </div>
    )
}
