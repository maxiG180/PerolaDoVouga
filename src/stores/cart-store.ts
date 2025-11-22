import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    menuItemId: string
    name: string
    price: number
    quantity: number
    image_url?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    total: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.menuItemId === newItem.menuItemId
                    )
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.menuItemId === newItem.menuItemId
                                    ? { ...item, quantity: item.quantity + newItem.quantity }
                                    : item
                            ),
                        }
                    }
                    return { items: [...state.items, { ...newItem, id: crypto.randomUUID() }] }
                })
            },
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: quantity > 0
                        ? state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
                        : state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
            },
        }),
        {
            name: 'perola-cart',
        }
    )
)
