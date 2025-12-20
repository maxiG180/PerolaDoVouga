'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SmartInsightsProps {
    lowMarginItems: number
    missingPlan: boolean
    salesTrend: 'up' | 'down' | 'stable'
    topDishName: string
}

export function SmartInsights({ lowMarginItems, missingPlan, salesTrend, topDishName }: SmartInsightsProps) {
    if (lowMarginItems === 0 && !missingPlan && salesTrend === 'stable' && !topDishName) return null

    return (
        <Card className="border-gold/30 bg-gold/5 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif font-bold text-primary-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-gold" />
                    Sugestões Inteligentes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {missingPlan && (
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-red-200">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-700 text-sm">Planeamento em Falta</p>
                            <p className="text-xs text-stone-600 mb-2">Ainda não definiu o menu para amanhã.</p>
                            <Button asChild size="sm" variant="outline" className="h-7 text-xs border-red-200 hover:bg-red-50 text-red-700">
                                <Link href="/admin/planning">Planear Agora <ArrowRight className="w-3 h-3 ml-1" /></Link>
                            </Button>
                        </div>
                    </div>
                )}

                {lowMarginItems > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-yellow-200">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-yellow-700 text-sm">Margens Baixas Detectadas</p>
                            <p className="text-xs text-stone-600 mb-2">{lowMarginItems} pratos têm margem de lucro inferior a 30%.</p>
                            <Button asChild size="sm" variant="outline" className="h-7 text-xs border-yellow-200 hover:bg-yellow-50 text-yellow-700">
                                <Link href="/admin/margins">Rever Preços <ArrowRight className="w-3 h-3 ml-1" /></Link>
                            </Button>
                        </div>
                    </div>
                )}

                {topDishName && (
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-green-200">
                        <TrendingUp className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-700 text-sm">Prato Estrela: {topDishName}</p>
                            <p className="text-xs text-stone-600">Este prato teve excelente saída hoje. Considere destacá-lo!</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
