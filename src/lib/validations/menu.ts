import { z } from 'zod'

export const menuItemSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    name_en: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'O preço não pode ser negativo'),
    category: z.string().min(1, 'Selecione uma categoria'),
    cuisine_type: z.enum(['Portuguese', 'African', 'Ukrainian', 'Other']).default('Portuguese'),
    photo_url: z.string().optional(),
    is_available: z.boolean().default(true),
    is_always_available: z.boolean().default(false),
    daily_type: z.enum(['none', 'soup', 'dish']).default('none'),
    allergens: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
    if (data.category !== 'Bebidas' && !data.photo_url) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A foto é obrigatória para esta categoria",
            path: ["photo_url"],
        });
    }
})

export type MenuItemFormData = z.infer<typeof menuItemSchema>
