export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://hippoobuyspreadsheet.com/sitemap.xml',
    host: 'https://hippoobuyspreadsheet.com',
  };
}
