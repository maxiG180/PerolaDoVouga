'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { parseWhatsAppMenu, ParsedMenuItem } from '@/lib/whatsappParser'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface WhatsAppImportDialogProps {
    isOpen: boolean
    onOpenChangeAction: (open: boolean) => void
    onImportedAction: (soups: any[], dishes: any[]) => void
}

export function WhatsAppImportDialog({ isOpen, onOpenChangeAction, onImportedAction }: WhatsAppImportDialogProps) {
    const [text, setText] = useState('')
    const [step, setStep] = useState<'input' | 'preview'>('input')
    const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([])
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleParse = () => {
        if (!text.trim()) return
        const items = parseWhatsAppMenu(text)
        if (items.length === 0) {
            toast.error('Não foi possível encontrar nenhum prato no texto colado.')
            return
        }
        setParsedItems(items)
        setStep('preview')
    }

    const handleImport = async () => {
        setLoading(true)
        try {
            const finalSoups: any[] = []
            const finalDishes: any[] = []

            for (const item of parsedItems) {
                // 1. Try to find existing item by name
                const { data: existing } = await (supabase
                    .from('menu_items')
                    .select('*')
                    .ilike('name', item.name)
                    .maybeSingle() as any)

                let menuItemId: string
                let menuItem: any

                if (existing) {
                    menuItemId = existing.id
                    menuItem = existing
                    // Update price if it changed (as per user request: "prices in db are not right")
                    if (existing.price !== item.price) {
                        const { data: updated } = await (supabase
                            .from('menu_items') as any)
                            .update({ price: item.price, description: item.description || existing.description })
                            .eq('id', menuItemId)
                            .select()
                            .single()
                        if (updated) menuItem = updated
                    }
                } else {
                    // Create new item
                    const { data: catData } = await (supabase
                        .from('categories')
                        .select('id')
                        .ilike('name', item.category === 'Sopas' ? 'Sopas' : (item.category === 'Peixe' ? 'Peixe' : 'Carne'))
                        .maybeSingle() as any)

                    const { data: newItem, error } = await (supabase
                        .from('menu_items') as any)
                        .insert({
                            name: item.name,
                            price: item.price,
                            description: item.description || null,
                            category_id: catData?.id || null,
                            daily_type: item.category === 'Sopas' ? 'soup' : 'dish',
                            cuisine_type: item.cuisineType,
                            is_available: true,
                            is_always_available: false,
                        })
                        .select()
                        .single()

                    if (error) throw error
                    menuItemId = newItem.id
                    menuItem = newItem
                }

                if (item.category === 'Sopas') {
                    finalSoups.push(menuItem)
                } else {
                    finalDishes.push(menuItem)
                }
            }

            onImportedAction(finalSoups, finalDishes)
            toast.success('Menu importado com sucesso!')
            onOpenChangeAction(false)
            reset()
        } catch (error) {
            console.error('Error importing menu:', error)
            toast.error('Erro ao importar menu. Verifique a consola.')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setText('')
        setStep('input')
        setParsedItems([])
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChangeAction(open)
            if (!open) reset()
        }}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Importar do WhatsApp</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {step === 'input' ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                Cole aqui o texto do menu que recebeu no WhatsApp:
                            </p>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Bom dia a todos! 📅 31/03 – Menu de Hoje..."
                                className="min-h-[300px] font-mono text-sm border-beige-200 focus:border-gold"
                            />
                            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 border border-blue-100">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-xs text-blue-700">
                                    O sistema irá identificar automaticamente os pratos, preços e categorias. 
                                    Poderá rever tudo antes de confirmar.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-stone-500 font-medium uppercase tracking-widest">
                                    {parsedItems.length} Itens Identificados
                                </p>
                            </div>
                            <div className="space-y-4">
                                {parsedItems.map((item, idx) => (
                                    <div key={idx} className="group relative flex items-center gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:border-gold/30 hover:shadow-xl transition-all duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center shadow-sm group-hover:bg-gold/10 transition-colors">
                                            <span className="text-2xl">
                                                {item.category === 'Sopas' ? '🥣' : 
                                                 (item.name.toLowerCase().includes('peixe') || item.category === 'Peixe') ? '🐟' :
                                                 (item.category === 'Carne' || item.name.toLowerCase().includes('carne') || item.name.toLowerCase().includes('vitela')) ? '🥩' : '🍽️'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-serif font-bold text-base text-stone-800">{item.name}</h4>
                                                <span className="font-bold text-gold-dark tracking-tight">{item.price.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 border-stone-200 text-stone-500">{item.category}</Badge>
                                                {item.isPratoDoDia && <Badge className="text-[9px] uppercase tracking-wider py-0 bg-gold/10 text-gold-dark hover:bg-gold/20 border-0">Prato do Dia</Badge>}
                                                {(item.cuisineType === 'ucraniana' || item.name.toLowerCase().includes('ucrânia')) && <Badge className="text-[9px] uppercase tracking-wider py-0 bg-stone-200 text-stone-600 border-0">🇺🇦 Especialidade</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => step === 'preview' ? setStep('input') : onOpenChangeAction(false)}>
                        {step === 'preview' ? 'Voltar' : 'Cancelar'}
                    </Button>
                    {step === 'input' ? (
                        <Button
                            className="bg-[#D4AF37] hover:bg-[#B39226] text-white"
                            onClick={handleParse}
                            disabled={!text.trim()}
                        >
                            Processar Texto
                        </Button>
                    ) : (
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            onClick={handleImport}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Confirmar Importação
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
