export interface ParsedMenuItem {
    name: string;
    description?: string;
    price: number;
    category: string;
    isPratoDoDia: boolean;
    cuisineType: 'portuguesa' | 'africana' | 'ucraniana' | 'other';
}

export function parseWhatsAppMenu(text: string): ParsedMenuItem[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let currentCategory = 'Outros';
    const items: ParsedMenuItem[] = [];
    let lastItem: ParsedMenuItem | null = null;

    // Prato do dia context
    let isInCategoryPratoDoDia = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect Category Headers
        if (line.includes('🍲 Sopas')) { currentCategory = 'Sopas'; isInCategoryPratoDoDia = false; continue; }
        if (line.includes('🐟 Peixe')) { currentCategory = 'Peixe'; isInCategoryPratoDoDia = false; continue; }
        if (line.includes('🥩 Carne')) { currentCategory = 'Carne'; isInCategoryPratoDoDia = false; continue; }
        if (line.includes('🍖 Outras Sugestões')) { currentCategory = 'Carne'; isInCategoryPratoDoDia = false; continue; }
        
        if (line.includes('⭐ Prato do Dia')) {
            isInCategoryPratoDoDia = true;
            if (line.toLowerCase().includes('peixe')) currentCategory = 'Peixe';
            if (line.toLowerCase().includes('carne')) currentCategory = 'Carne';
            continue;
        }

        // Match Item + Price
        // Pattern matches: name [-|—|–] price €
        // The price part usually ends the line or is near the end.
        const priceRegex = /([-—–])\s*([\d,.]+)\s*€/i;
        const match = line.match(priceRegex);
        
        if (match) {
            const separatorIdx = line.lastIndexOf(match[0]);
            let name = line.substring(0, separatorIdx).trim();
            
            // Clean up name: remove common item indicators
            // E.g. "Sopa: sopa de...", "🐟 Salmão", "⭐ Prato do Dia – Carne: Esparguete..."
            name = name.replace(/^(Sopa:|\s*🥣|\s*🐟|\s*🍽️|\s*🍚|\s*🥚🍤|\s*🥩|\s*🍳|\s*🍔|\s*🐖|\s*🍗|\s*🦃|\s*⭐\s*Prato do Dia\s*[–-]\s*(Carne|Peixe):?|⭐)\s*/i, '').trim();
            
            // Further clean leading emojis and bullet points
            name = name.replace(/^[\s\d\.\-\*•_]+/, '').trim();
            // Remove starting emoji if any (like 🍚 🐟)
            name = name.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+\s*/u, '').trim();
            
            const price = parseFloat(match[2].replace(',', '.'));
            
            const item: ParsedMenuItem = {
                name,
                price,
                category: currentCategory,
                isPratoDoDia: line.includes('⭐') || isInCategoryPratoDoDia,
                cuisineType: (line.toLowerCase().includes('ucraniana') || line.toLowerCase().includes('ucrânia')) ? 'ucraniana' : 'portuguesa'
            };
            
            items.push(item);
            lastItem = item;
        } else if (line.startsWith('(') && lastItem) {
            // It's a description for the last item (e.g. ingredients)
            const desc = line.replace(/^\(|\)$/g, '');
            lastItem.description = (lastItem.description ? lastItem.description + ' ' : '') + desc;
            if (line.toLowerCase().includes('ucraniana') || line.toLowerCase().includes('ucrânia')) {
                lastItem.cuisineType = 'ucraniana';
            }
        }
    }
    
    return items;
}
