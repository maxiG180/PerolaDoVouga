'use client'

/**
 * LocalBusinessSchema Component
 * 
 * Provides JSON-LD structured data for Google's Local Business schema.
 * This helps Google understand the restaurant details and display them in search results.
 */
export function LocalBusinessSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Pérola do Vouga',
        image: 'https://peroladovouga.com/logo.png',
        '@id': 'https://peroladovouga.com',
        url: 'https://peroladovouga.com',
        telephone: '+351218464584',
        email: 'peroladovougalda@gmail.com',
        priceRange: '€€',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Alm. Reis 243 A',
            addressLocality: 'Lisboa',
            postalCode: '1000-051',
            addressCountry: 'PT'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 38.7305,
            longitude: -9.1363
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '07:00',
                closes: '18:30'
            }
        ],
        servesCuisine: 'Portuguese',
        acceptsReservations: false,
        sameAs: [
            'https://www.facebook.com/share/1JsK9ftJaX/?mibextid=wwXIfr',
            'https://www.instagram.com/peroladovougaltd'
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
