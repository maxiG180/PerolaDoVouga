import { PlanningWizard } from '@/components/admin/planning/PlanningWizard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AdminPlanningPage() {
    return (
        <div className="space-y-6 pb-20"> {/* Added padding bottom for mobile scroll */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="md:hidden">
                        <Link href="/admin">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-900">
                        Planeamento Diário
                    </h1>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/admin">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao Painel
                    </Link>
                </Button>
            </div>

            <PlanningWizard />
        </div>
    )
}
