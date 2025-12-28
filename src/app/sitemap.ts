import { MetadataRoute } from 'next'

/**
 * Sitemap Generator
 * 
 * Creates a sitemap.xml file that helps search engines discover all pages on the site.
 * Includes both Portuguese and English versions of each page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://peroladovouga.com'

    // Define all public pages
    const routes = ['', '/menu', '/about']
    const locales = ['pt', 'en']

    // Generate sitemap entries for all page/locale combinations
    const sitemapEntries: MetadataRoute.Sitemap = []

    routes.forEach(route => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            })
        })
    })

    return sitemapEntries
}
