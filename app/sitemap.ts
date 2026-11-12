import type { MetadataRoute } from "next";
import dbConnect from "./lib/mongodb";
import Product from "./lib/models/Product";

const BASE_URL = "https://www.and4web.co.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/projects`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refund`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    await dbConnect();

    const products = await Product.find({
      status: "active",
      "downloadFile.storageKey": { $exists: true, $ne: "" },
    })
      .select("slug updatedAt")
      .lean();

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/projects/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return staticPages;
  }
}
