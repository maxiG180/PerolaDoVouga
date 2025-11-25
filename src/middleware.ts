import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
});

export default async function middleware(request: NextRequest) {
    // 1. Run Supabase middleware first to refresh session and handle auth redirects
    const response = await updateSession(request);

    // If Supabase middleware returned a redirect (e.g. to login), return it immediately
    if (response.status === 307 || response.status === 302) {
        return response;
    }

    // 2. Run next-intl middleware
    const intlResponse = intlMiddleware(request);

    // Copy cookies from Supabase response to Intl response (to persist session updates)
    response.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return intlResponse;
}

export const config = {
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
