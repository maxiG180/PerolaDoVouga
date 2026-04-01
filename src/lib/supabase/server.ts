import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies as getCookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient(useServiceRole = false) {
    const cookieStore = await getCookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = useServiceRole 
        ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Handle cookie setting error in server components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Handle cookie removal error
                    }
                },
            },
        }
    )
}
