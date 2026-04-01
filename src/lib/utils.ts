import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
    if (price === 0) return 'Preço a confirmar'
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
    }).format(price)
}

export function getLocalDate(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Lisbon',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}
