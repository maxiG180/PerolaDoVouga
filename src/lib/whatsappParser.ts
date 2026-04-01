export interface ParsedMenuItem {
    name: string;
    description?: string;
    price: number;
    category: string;
    isPratoDoDia: boolean;
    cuisineType: 'portuguesa' | 'africana' | 'ucraniana' | 'other';
    emoji?: string;
}

export function parseWhatsAppMenu(text: string): ParsedMenuItem[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let currentCategory = 'Outros';
    const items: ParsedMenuItem[] = [];
    let lastItem: ParsedMenuItem | null = null;

    // Prato do dia context
    let isInCategoryPratoDoDia = false;

    // Categorized emojis lookup
    const categoryEmojis: Record<string, string> = {
        'Sopas': '🥣',
        'Peixe': '🐟',
        'Carne': '🥩',
        'Sobremesas': '🍰',
        'Bebidas': '🍷',
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect Category Headers
        if (/🍲 Sopas/i.test(line)) { currentCategory = 'Sopas'; isInCategoryPratoDoDia = false; continue; }
        if (/🐟 Peixe/i.test(line)) { currentCategory = 'Peixe'; isInCategoryPratoDoDia = false; continue; }
        if (/🥩 Carne/i.test(line)) { currentCategory = 'Carne'; isInCategoryPratoDoDia = false; continue; }
        if (/🍖 Outras Sugestões/i.test(line)) { currentCategory = 'Sugestões de Carne'; isInCategoryPratoDoDia = false; continue; }
        
        if (/⭐ Prato do Dia/i.test(line)) {
            isInCategoryPratoDoDia = true;
            if (line.toLowerCase().includes('peixe')) currentCategory = 'Peixe';
            if (line.toLowerCase().includes('carne')) currentCategory = 'Carne';
            continue;
        }

        // Match Item + Price
        // Pattern matches: name followed by optional separator and price ending in €
        // Allows: 
        // Bacalhau - 12€
        // Bacalhau: 12.50€
        // Bacalhau 12,50€
        const priceRegex = /[:\-—–]?\s*([\d,.]+)\s*€/i;
        const match = line.match(priceRegex);
        
        if (match && match.index! > 0) {
            const separatorIdx = match.index!;
            let name = line.substring(0, separatorIdx).trim();
            
            // Extract starting emoji if any
            const emojiMatch = name.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+)\s*/u);
            const foundEmoji = emojiMatch ? emojiMatch[1] : categoryEmojis[currentCategory];

            // Clean up name: remove common item indicators
            name = name.replace(/^(Sopa:|\s*🥣|\s*🐟|\s*🍽️|\s*🍚|\s*🥚🍤|\s*🥩|\s*🍳|\s*🍔|\s*🐖|\s*🍗|\s*🦃|\s*⭐\s*Prato do Dia\s*[–-]\s*(Carne|Peixe):?|⭐)\s*/i, '').trim();
            
            // Further clean leading emojis and bullet points
            name = name.replace(/^[\s\d\.\-\*•_]+/, '').trim();
            // Remove starting emoji if any
            name = name.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+\s*/u, '').trim();
            
            const price = parseFloat(match[1].replace(',', '.'));
            
            if (isNaN(price)) continue;

            const item: ParsedMenuItem = {
                name,
                price,
                category: currentCategory,
                isPratoDoDia: line.includes('⭐') || isInCategoryPratoDoDia,
                cuisineType: (line.toLowerCase().includes('ucraniana') || line.toLowerCase().includes('ucrânia')) ? 'ucraniana' : 'portuguesa',
                emoji: foundEmoji
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
