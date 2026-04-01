import { parseWhatsAppMenu } from './src/lib/whatsappParser'

const text1 = `Bom dia a todos!

📅 31/03 – Menu de Hoje
🍲 Sopas
 Sopa: sopa de couve portuguesa com feijão — 2,00 €

🥣 Sopa de Beterraba com Rabo de Boi 🐂 — 7,80 €
(Beterraba estufada, cenoura, cebola, feijão vermelho, couve, batata e rabo de boi – prato tradicional da cozinha ucraniana)

🐟 Peixe
🐟 Salmão Grelhado—12,50€

🍽️ Pescada Cozida com batata e legumes — 11,00 €
🐟 Dourada grelhada -
 12,00€ 
🍚 🐟 Bacalhau cozido com grão e legumes -14.00 €

🥚🍤 Omelete de camarão -  9,0€
🍚 🐟 Bacalhau com natas -10.00 €

⭐ Prato do Dia – Peixe
🍚 🐟 Lulas estufadas com puré -10.00 €

🥩 Carne

⭐ Prato do Dia – Carne: 

🦃 Espetada de peru com batatas assadas no forno à moda da casa - 9,80€

🐂  Rolinhos de couve recheados com carne de vitela e arroz, acompanhados de puré de batata ou batata frita - 9,80€
(Prato tradicional da Ucrânia, preparado com folhas de couve recheadas).

🍖 Outras Sugestões de Carne:

🥩 Picanha grelhada com feijão preto e arroz - 14,00€

🥩 Iscas à Portuguesa— 8,5 €
🍳 Alheira Frita com Ovo — 9,50 €
🥩 Bitoque de Novilho — 11,50 €
🥩 Costeleta de Novilho — 11,50 €
🍔 Hambúrguer de vitela com batata frita e ovo -9,0€
 
🐖 Secretos de Porco Grelhados — 9,50 €
🍗 Bifinhos de Frango Grelhados — 9,00 €
🦃 Bifinhos de Peru Grelhados — 9,50 €

Todas as encomendas podem ser enviadas por mensagem privada, sff.
Muito obrigado e bom apetite!`

const items = parseWhatsAppMenu(text1)
console.log(JSON.stringify(items, null, 2))
