# Plano de Internacionalização (i18n) - Pérola do Vouga

## 📋 Resumo Executivo

Este documento descreve o plano para adicionar suporte multi-idioma (Português/Inglês) ao site da Pérola do Vouga.

## 🎯 Objetivos

1. **Idioma Principal**: Português de Portugal (pt-PT)
2. **Idioma Secundário**: Inglês (en)
3. **Seletor de Idioma**: Bandeiras clicáveis no header
4. **Conteúdo Editável**: Horários podem ser editados via Admin Dashboard

## 🛠️ Implementação Técnica

### Fase 1: Configuração Base (Recomendado: next-intl)

```bash
npm install next-intl
```

### Estrutura de Ficheiros:
```
src/
├── i18n/
│   ├── locales/
│   │   ├── pt.json    # Português (padrão)
│   │   └── en.json    # Inglês
│   └── config.ts
├── middleware.ts       # Deteção de idioma
└── app/
    └── [locale]/       # Rotas dinâmicas por idioma
```

### Fase 2: Ficheiros de Tradução

**pt.json** (Português - Idioma Principal):
```json
{
  "nav": {
    "home": "Início",
    "menu": "Menu",
    "about": "Sobre Nós",
    "contact": "Contacto"
  },
  "home": {
    "welcome": "Bem-vindo à Pérola do Vouga",
    "tagline": "Sabores que Encantam",
    "description": "Uma experiência gastronómica única onde a tradição encontra a elegância.",
    "cta_menu": "Ver Menu Completo",
    "cta_about": "A Nossa História"
  },
  "hours": {
    "title": "Horário",
    "weekdays": "Segunda a Sábado",
    "time": "07:00 - 18:30",
    "sunday": "Domingo",
    "closed": "Encerrado"
  },
  "features": {
    "title": "Porque Nos Escolher",
    "subtitle": "Três razões que fazem da Pérola do Vouga o seu destino gastronómico preferido",
    "authentic": {
      "title": "Cozinha Autêntica",
      "description": "Receitas tradicionais preparadas com um toque moderno e ingredientes locais selecionados com cuidado."
    },
    "cozy": {
      "title": "Ambiente Acolhedor",
      "description": "Um espaço pensado para o seu conforto, perfeito para momentos especiais com família e amigos."
    },
    "quality": {
      "title": "Qualidade Premium",
      "description": "Compromisso absoluto com a excelência em cada prato que servimos, do início ao fim."
    }
  },
  "visit": {
    "title": "Estamos à sua espera",
    "description": "Venha conhecer o nosso espaço e desfrutar de uma refeição inesquecível. Estamos localizados no coração de Lisboa, com fácil acesso.",
    "address": "Morada",
    "hours": "Horário",
    "contact": "Contacto"
  }
}
```

**en.json** (English):
```json
{
  "nav": {
    "home": "Home",
    "menu": "Menu",
    "about": "About Us",
    "contact": "Contact"
  },
  "home": {
    "welcome": "Welcome to Pérola do Vouga",
    "tagline": "Flavors that Enchant",
    "description": "A unique gastronomic experience where tradition meets elegance.",
    "cta_menu": "View Full Menu",
    "cta_about": "Our Story"
  },
  "hours": {
    "title": "Opening Hours",
    "weekdays": "Monday to Saturday",
    "time": "07:00 - 18:30",
    "sunday": "Sunday",
    "closed": "Closed"
  },
  "features": {
    "title": "Why Choose Us",
    "subtitle": "Three reasons that make Pérola do Vouga your preferred gastronomic destination",
    "authentic": {
      "title": "Authentic Cuisine",
      "description": "Traditional recipes prepared with a modern touch and carefully selected local ingredients."
    },
    "cozy": {
      "title": "Cozy Atmosphere",
      "description": "A space designed for your comfort, perfect for special moments with family and friends."
    },
    "quality": {
      "title": "Premium Quality",
      "description": "Absolute commitment to excellence in every dish we serve, from start to finish."
    }
  },
  "visit": {
    "title": "We're waiting for you",
    "description": "Come visit our space and enjoy an unforgettable meal. We are located in the heart of Lisbon, with easy access.",
    "address": "Address",
    "hours": "Hours",
    "contact": "Contact"
  }
}
```

### Fase 3: Componente de Seletor de Idioma

**src/components/LanguageSwitcher.tsx**:
```tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => switchLanguage('pt')}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
          locale === 'pt' 
            ? 'bg-gold/20 border border-gold' 
            : 'opacity-60 hover:opacity-100'
        }`}
        aria-label="Português"
      >
        <span className="text-2xl">🇵🇹</span>
        <span className="text-sm font-medium">PT</span>
      </button>
      
      <button
        onClick={() => switchLanguage('en')}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
          locale === 'en' 
            ? 'bg-gold/20 border border-gold' 
            : 'opacity-60 hover:opacity-100'
        }`}
        aria-label="English"
      >
        <span className="text-2xl">🇬🇧</span>
        <span className="text-sm font-medium">EN</span>
      </button>
    </div>
  )
}
```

### Fase 4: Horários Editáveis via Admin

**Atualização na tabela `site_settings`**:
```sql
-- Já existe! Apenas adicionar estas entradas:
INSERT INTO site_settings (key, value) VALUES
  ('opening_hours_weekdays', 'Segunda a Sábado: 07:00 - 18:30'),
  ('opening_hours_weekend', 'Domingo: Encerrado')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

**Componente para exibir horários dinâmicos**:
```tsx
// src/components/BusinessHours.tsx
import { createClient } from '@/lib/supabase/server'

export async function BusinessHours() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['opening_hours_weekdays', 'opening_hours_weekend'])
  
  const hours = {
    weekdays: data?.find(s => s.key === 'opening_hours_weekdays')?.value || 'Segunda a Sábado: 07:00 - 18:30',
    weekend: data?.find(s => s.key === 'opening_hours_weekend')?.value || 'Domingo: Encerrado'
  }
  
  return (
    <div>
      <h4 className="font-bold text-lg mb-1 text-white">Horário</h4>
      <p className="text-beige-200">
        {hours.weekdays}<br />
        {hours.weekend}
      </p>
    </div>
  )
}
```

## 📅 Cronograma de Implementação

### Imediato (Já Feito ✅):
- ✅ Horários atualizados: Segunda a Sábado 07:00-18:30, Domingo Encerrado
- ✅ Site em Português de Portugal bem escrito
- ✅ Tabela `site_settings` criada para edição de horários

### Próximos Passos (Quando Necessário):
1. **Instalar next-intl** (5 min)
2. **Criar ficheiros de tradução** pt.json e en.json (30 min)
3. **Adicionar seletor de bandeiras** no Header (15 min)
4. **Testar mudança de idioma** (15 min)
5. **Traduzir conteúdo do admin** (opcional, 1h)

## 🎨 Design do Seletor de Idioma

Localização: **Header (canto superior direito)**

```
[🇵🇹 PT] [🇬🇧 EN]
```

- Bandeira ativa: Fundo dourado + borda
- Bandeira inativa: Opacidade 60%, hover 100%
- Transição suave entre idiomas
- Mantém a página atual ao trocar idioma

## 💡 Notas Importantes

1. **Horários Futuros**: Quando decidirem fazer cozinha oriental, basta editar via `/admin/settings`
2. **SEO**: Cada idioma terá URLs próprias (`/pt/menu`, `/en/menu`)
3. **Cookies**: O idioma escolhido é guardado para próximas visitas
4. **Fallback**: Se tradução não existir, usa Português

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install next-intl

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

---

**Status Atual**: ✅ Site 100% em Português de Portugal, horários corretos
**Próximo Passo**: Implementar i18n quando necessário (instruções acima)
