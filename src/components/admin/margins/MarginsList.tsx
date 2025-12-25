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

            <div className="grid gap-6">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="shadow-lg border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                        <div className={`h-2 w-full ${item.status === 'excellent' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                            item.status === 'good' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                item.status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                            }`} />
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-primary-900 mb-1">{item.name}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <span>Venda: <span className="font-semibold text-primary-900">€{item.sellingPrice.toFixed(2)}</span></span>
                                        <span>Custo: <span className="font-semibold text-red-600">€{item.cost.toFixed(2)}</span></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${item.status === 'critical' ? 'text-red-600' :
                                        item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {item.margin.toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Margem</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {item.status === 'critical' && (
                                        <Badge variant="destructive" className="flex gap-1">
                                            <AlertCircle className="w-3 h-3" /> Crítico
                                        </Badge>
                                    )}
                                    {item.status === 'warning' && (
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                            Atenção
                                        </Badge>
                                    )}
                                    {item.status === 'good' && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                            Bom
                                        </Badge>
                                    )}
                                    {item.status === 'excellent' && (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                            Excelente
                                        </Badge>
                                    )}
                                </div>
                                <Button asChild size="sm" variant="outline" className="gap-2 h-10 px-4">
                                    <Link href={`/admin/margins/${item.id}/edit`}>
                                        <Edit className="w-4 h-4" />
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
