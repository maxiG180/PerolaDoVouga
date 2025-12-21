import { z } from 'zod'

export const menuItemSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    name_en: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'O preço não pode ser negativo'),
    category: z.string().min(1, 'Selecione uma categoria'),
    cuisine_type: z.enum(['Portuguese', 'African', 'Ukrainian', 'Other']).optional(),
    photo_url: z.string().optional(),
    is_available: z.boolean().optional(),
    is_always_available: z.boolean().optional(),
    daily_type: z.enum(['none', 'soup', 'dish']).optional(),
    allergens: z.array(z.string()).optional(),
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
