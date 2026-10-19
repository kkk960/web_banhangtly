import Marketplace from "@/components/marketplace";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, productCount, sellerCount] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { seller: true, category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.seller.count(),
  ]);

  return (
    <Marketplace
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        condition: product.condition,
        location: product.location,
        isFeatured: product.isFeatured,
        category: product.category.name,
        seller: product.seller.name,
      }))}
      categories={categories.map((category) => ({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
      }))}
      productCount={productCount}
      sellerCount={sellerCount}
    />
  );
}
