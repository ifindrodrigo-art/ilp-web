import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { ministries } = await getContent();
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/visitanos", 0.9, "monthly"],
    ["/eventos", 0.9, "weekly"],
    ["/ministerios", 0.8, "monthly"],
    ["/nosotros", 0.7, "monthly"],
    ["/predicas", 0.7, "weekly"],
    ["/galeria", 0.6, "weekly"],
    ["/contacto", 0.6, "yearly"],
    ["/privacidad", 0.2, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority })),
    ...ministries.map((m) => ({ url: `${SITE_URL}/ministerios/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
