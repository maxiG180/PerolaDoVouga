'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <div className="flex gap-3 items-center bg-white/10 backdrop-blur-sm p-1 rounded-full border border-white/20">
            <button
                onClick={() => switchLanguage('pt')}
                className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
                    locale === 'pt'
                        ? "bg-white shadow-md scale-110"
                        : "opacity-60 hover:opacity-100 hover:bg-white/20"
                )}
                aria-label="Português"
            >
                <span className="fi fi-pt rounded-full w-6 h-6 !bg-cover"></span>
            </button>

            <button
                onClick={() => switchLanguage('en')}
                className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
                    locale === 'en'
                        ? "bg-white shadow-md scale-110"
                        : "opacity-60 hover:opacity-100 hover:bg-white/20"
                )}
                aria-label="English"
            >
                <span className="fi fi-gb rounded-full w-6 h-6 !bg-cover"></span>
            </button>
        </div>
    )
}
