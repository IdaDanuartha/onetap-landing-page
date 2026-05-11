import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/checkout/',
        '/payment/',
        '/l/', // Likely short links/redirects
        '/r/', // Likely short links/redirects
      ],
    },
    sitemap: 'https://www.onetap-charm.com/sitemap.xml',
  };
}
