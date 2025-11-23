import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    const locales = ['pt', 'en'];

    if (!locale || !locales.includes(locale as any)) {
        locale = 'pt';
    }

    return {
        locale: locale as string,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
