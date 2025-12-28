'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Edit } from 'lucide-react'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/search-bar'

interface MarginItem {
    id: number | string
    name: string
    sellingPrice: number
    cost: number
    margin: number
    status: 'excellent' | 'good' | 'warning' | 'critical'
}

interface MarginsListProps {
    items: MarginItem[]
}

export function MarginsList({ items }: MarginsListProps) {
    const [search, setSearch] = useState('')

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="w-full max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Procurar prato..."
                />
            </div>

            {/* Desktop Table - Excel Style */}
            <div className="hidden md:block overflow-hidden border border-gray-400">
                <div className="bg-gray-200 border-b border-gray-400">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-4 px-2 py-1 font-semibold text-xs text-gray-800 border-r border-gray-400 uppercase tracking-wider">Prato</div>
                        <div className="col-span-2 px-2 py-1 font-semibold text-xs text-gray-800 border-r border-gray-400 text-right uppercase tracking-wider">Venda</div>
                        <div className="col-span-2 px-2 py-1 font-semibold text-xs text-gray-800 border-r border-gray-400 text-right uppercase tracking-wider">Custo</div>
                        <div className="col-span-2 px-2 py-1 font-semibold text-xs text-gray-800 border-r border-gray-400 text-right uppercase tracking-wider">Margem %</div>
                        <div className="col-span-1 px-2 py-1 font-semibold text-xs text-gray-800 border-r border-gray-400 text-center uppercase tracking-wider">Estado</div>
                        <div className="col-span-1 px-2 py-1 font-semibold text-xs text-gray-800 text-center uppercase tracking-wider">Ações</div>
                    </div>
                </div>

                <div className="bg-white">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`grid grid-cols-12 gap-0 border-b border-gray-300 hover:bg-blue-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                            <div className="col-span-4 px-2 py-1 text-xs text-gray-900 border-r border-gray-300 truncate font-medium flex items-center">
                                {item.name}
                            </div>
                            <div className="col-span-2 px-2 py-1 text-xs font-mono text-gray-900 border-r border-gray-300 text-right flex items-center justify-end">
                                €{item.sellingPrice.toFixed(2)}
                            </div>
                            <div className="col-span-2 px-2 py-1 text-xs font-mono text-gray-900 border-r border-gray-300 text-right flex items-center justify-end">
                                €{item.cost.toFixed(2)}
                            </div>
                            <div className={`col-span-2 px-2 py-1 text-xs font-mono border-r border-gray-300 text-right font-bold flex items-center justify-end ${item.status === 'critical' ? 'text-red-600' :
                                item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                {item.margin.toFixed(0)}%
                            </div>
                            <div className="col-span-1 px-2 py-1 text-xs border-r border-gray-300 text-center flex items-center justify-center">
                                {item.status === 'critical' && <span className="text-red-600 font-bold">Crítico</span>}
                                {item.status === 'warning' && <span className="text-yellow-600 font-bold">Atenção</span>}
                                {item.status === 'good' && <span className="text-green-600 font-bold">Bom</span>}
                                {item.status === 'excellent' && <span className="text-emerald-600 font-bold">Excelente</span>}
                            </div>
                            <div className="col-span-1 px-2 py-1 text-xs text-center flex justify-center items-center">
                                <Link href={`/admin/margins/${item.id}/edit`} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded">
                                    <Edit className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="shadow-sm border-gray-200 overflow-hidden">
                        <div className={`h-1.5 w-full ${item.status === 'excellent' ? 'bg-emerald-500' :
                            item.status === 'good' ? 'bg-green-500' :
                                item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-base text-gray-900 mb-1">{item.name}</h3>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                                        <span>Venda: <strong>€{item.sellingPrice.toFixed(2)}</strong></span>
                                        <span>Custo: <strong className="text-red-600">€{item.cost.toFixed(2)}</strong></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-bold ${item.status === 'critical' ? 'text-red-600' :
                                        item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {item.margin.toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    {item.status === 'critical' && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Crítico</span>}
                                    {item.status === 'warning' && <span className="text-xs font-bold text-yellow-600">Atenção</span>}
                                    {item.status === 'good' && <span className="text-xs font-bold text-green-600">Bom</span>}
                                </div>
                                <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs">
                                    <Link href={`/admin/margins/${item.id}/edit`}>
                                        Editar
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{items.length === 0 ? 'Nenhum prato encontrado.' : 'Nenhum prato corresponde à pesquisa.'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
