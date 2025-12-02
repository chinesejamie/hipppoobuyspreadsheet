import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { generateSlug } from '@/lib/slugify';
import { getAllArticles } from '@/lib/articles';

export default async function sitemap() {
  const baseUrl = 'https://oopbuyproducts.net';

  try {
    await connectDB();

    // Get all product IDs and names
    const products = await Product.find({ hidden: { $ne: true } })
      .select('_id name updatedAt')
      .lean()
      .limit(50000); // Sitemap limit

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${generateSlug(product.name, product._id)}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // Blog articles
    const articles = getAllArticles();
    const blogUrls = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];

    return [...staticPages, ...blogUrls, ...productUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
