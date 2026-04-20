import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { generateSlug } from '@/lib/slugify';
import { getAllArticles } from '@/lib/articles';

const baseUrl = 'https://hippoobuyspreadsheet.com';

export default async function sitemap() {
  try {
    await connectDB();

    const products = await Product.find({ hidden: { $ne: true } })
      .select('_id name updatedAt')
      .lean()
      .limit(50000);

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${generateSlug(product.name, product._id)}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const articles = getAllArticles();
    const blogUrls = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    const staticPages = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ];

    return [...staticPages, ...blogUrls, ...productUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }];
  }
}
