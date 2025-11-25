import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()

    // console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User: ${user ? user.id : 'null'}`)

    // Protected routes pattern
    // If path contains /admin AND does NOT contain /login, it requires authentication
    if (request.nextUrl.pathname.includes('/admin') && !request.nextUrl.pathname.includes('/login')) {
        if (!user) {
            // console.log('[Middleware] User not found on protected route, redirecting to login')
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            const redirectResponse = NextResponse.redirect(url)

            // Copy cookies to ensure session updates are preserved
            response.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
            })
            return redirectResponse
        }
    }

    return response
}
