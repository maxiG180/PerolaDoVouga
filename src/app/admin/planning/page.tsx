'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category?: { name: string };
    cuisine_type?: string;
}

export default function DailyPlanningPage() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSoup, setSelectedSoup] = useState<MenuItem | null>(null);
    const [selectedPratos, setSelectedPratos] = useState<MenuItem[]>([]);
    const [notes, setNotes] = useState('');

    const [soupSearch, setSoupSearch] = useState('');
    const [pratoSearch, setPratoSearch] = useState('');
    const [soups, setSoups] = useState<MenuItem[]>([]);
    const [pratos, setPratos] = useState<MenuItem[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (soupSearch.length > 0) {
            searchSoups();
        }
    }, [soupSearch]);

    useEffect(() => {
        if (pratoSearch.length > 0) {
            searchPratos();
        }
    }, [pratoSearch]);

    const searchSoups = async () => {
        try {
            const res = await fetch(`/api/admin/search-soups?search=${encodeURIComponent(soupSearch)}`);
            const data = await res.json();
            setSoups(data.soups || []);
        } catch (error) {
            console.error('Error searching soups:', error);
        }
    };

    const searchPratos = async () => {
        try {
            const res = await fetch(`/api/admin/search-pratos?search=${encodeURIComponent(pratoSearch)}`);
            const data = await res.json();
            setPratos(data.pratos || []);
        } catch (error) {
            console.error('Error searching pratos:', error);
        }
    };

    const togglePrato = (prato: MenuItem) => {
        setSelectedPratos(prev => {
            const exists = prev.find(p => p.id === prato.id);
            if (exists) {
                return prev.filter(p => p.id !== prato.id);
            } else {
                return [...prev, prato];
            }
        });
    };

    const savePlanning = async () => {
        if (!selectedSoup) {
            toast.error('Por favor, selecione uma sopa');
            return;
        }

        if (selectedPratos.length === 0) {
            toast.error('Por favor, selecione pelo menos um prato');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/daily-planning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    soupId: selectedSoup.id,
                    selectedPratos: selectedPratos.map(p => ({ id: p.id })),
                    notes,
                }),
            });

            if (!res.ok) throw new Error('Failed to save planning');

            toast.success('Menu do dia salvo com sucesso!');

            // Reset form
            setSelectedSoup(null);
            setSelectedPratos([]);
            setNotes('');
            setSoupSearch('');
            setPratoSearch('');
        } catch (error) {
            console.error('Error saving planning:', error);
            toast.error('Erro ao salvar menu do dia');
        } finally {
            setLoading(false);
        }
    };

    const copyFromYesterday = async () => {
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        try {
            const res = await fetch(`/api/admin/daily-planning?date=${yesterdayStr}`);
            const data = await res.json();

            if (data.planning) {
                setSelectedSoup(data.planning.soup);
                setSelectedPratos(data.planning.daily_menu_items?.map((item: any) => item.menu_items) || []);
                setNotes(data.planning.notes || '');
                toast.success('Menu copiado do dia anterior');
            } else {
                toast.error('Nenhum menu encontrado para o dia anterior');
            }
        } catch (error) {
            console.error('Error copying from yesterday:', error);
            toast.error('Erro ao copiar menu');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Planeamento do Menu Diário</h1>

            <div className="grid gap-6">
                {/* Date Selection */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <Label htmlFor="date">Data</Label>
                    <div className="flex gap-4 mt-2">
                        <Input
                            id="date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="max-w-xs"
                        />
                        <Button variant="outline" onClick={copyFromYesterday}>
                            Copiar do Dia Anterior
                        </Button>
                    </div>
                </div>

                {/* Soup Selection */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Sopa do Dia</h2>
                    <Input
                        placeholder="Pesquisar sopas..."
                        value={soupSearch}
                        onChange={(e) => setSoupSearch(e.target.value)}
                        className="mb-4"
                    />

                    {selectedSoup && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{selectedSoup.name}</p>
                                    <p className="text-sm text-gray-600">€{selectedSoup.price.toFixed(2)}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedSoup(null)}>
                                    Remover
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                        {soups.map((soup) => (
                            <button
                                key={soup.id}
                                onClick={() => setSelectedSoup(soup)}
                                className={`p-3 border rounded text-left hover:bg-gray-50 ${selectedSoup?.id === soup.id ? 'bg-green-50 border-green-500' : ''
                                    }`}
                            >
                                <p className="font-medium">{soup.name}</p>
                                <p className="text-sm text-gray-600">€{soup.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pratos Selection */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Pratos do Dia</h2>
                    <Input
                        placeholder="Pesquisar pratos..."
                        value={pratoSearch}
                        onChange={(e) => setPratoSearch(e.target.value)}
                        className="mb-4"
                    />

                    {selectedPratos.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Selecionados ({selectedPratos.length}):</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedPratos.map((prato) => (
                                    <span
                                        key={prato.id}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {prato.name}
                                        <button
                                            onClick={() => togglePrato(prato)}
                                            className="hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                        {pratos.map((prato) => {
                            const isSelected = selectedPratos.some(p => p.id === prato.id);
                            return (
                                <button
                                    key={prato.id}
                                    onClick={() => togglePrato(prato)}
                                    className={`p-3 border rounded text-left hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{prato.name}</p>
                                            <p className="text-sm text-gray-600">
                                                €{prato.price.toFixed(2)} • {prato.category?.name}
                                                {prato.cuisine_type && ` • ${prato.cuisine_type}`}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <span className="text-blue-600">✓</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notas sobre o menu do dia..."
                        className="mt-2"
                        rows={3}
                    />
                </div>

                {/* Save Button */}
                <Button
                    onClick={savePlanning}
                    disabled={loading || !selectedSoup || selectedPratos.length === 0}
                    size="lg"
                    className="w-full"
                >
                    {loading ? 'A guardar...' : 'Guardar Menu do Dia'}
                </Button>
            </div>
        </div>
    );
}
