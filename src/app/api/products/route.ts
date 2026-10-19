import { NextResponse } from "next/server";
import { ProductCondition } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const validConditions = new Set<string>(Object.values(ProductCondition));

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Thông tin món đồ không hợp lệ." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const location = typeof input.location === "string" ? input.location.trim() : "";
  const sellerName = typeof input.sellerName === "string" ? input.sellerName.trim() : "";
  const categorySlug = typeof input.categorySlug === "string" ? input.categorySlug : "";
  const condition = typeof input.condition === "string" ? input.condition : "";
  const imageUrl = typeof input.imageUrl === "string" ? input.imageUrl.trim() : "";
  const price = Number(input.price);

  if (
    name.length < 3 ||
    name.length > 90 ||
    description.length < 10 ||
    description.length > 1000 ||
    location.length < 2 ||
    location.length > 100 ||
    sellerName.length < 2 ||
    sellerName.length > 60 ||
    !Number.isSafeInteger(price) ||
    price < 1000 ||
    price > 1_000_000_000 ||
    !validConditions.has(condition) ||
    (imageUrl && !isValidImageUrl(imageUrl))
  ) {
    return NextResponse.json(
      { error: "Vui lòng kiểm tra tên, mô tả, giá và thông tin liên hệ." },
      { status: 400 },
    );
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return NextResponse.json({ error: "Danh mục này hiện không tồn tại." }, { status: 400 });
  }

  const product = await prisma.$transaction(async (transaction) => {
    const seller = await transaction.seller.create({
      data: { name: sellerName, location },
    });
    return transaction.product.create({
      data: {
        name,
        description,
        price,
        location,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
        condition: condition as ProductCondition,
        sellerId: seller.id,
        categoryId: category.id,
      },
    });
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["images.unsplash.com", "i.imgur.com"].includes(url.hostname);
  } catch {
    return false;
  }
}
