import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Thông tin đơn hàng không hợp lệ." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const buyerName = typeof input.buyerName === "string" ? input.buyerName.trim() : "";
  const buyerEmail = typeof input.buyerEmail === "string" ? input.buyerEmail.trim() : "";
  const productIds = Array.isArray(input.productIds)
    ? [...new Set(input.productIds.filter((id): id is string => typeof id === "string"))]
    : [];

  if (
    buyerName.length < 2 ||
    buyerName.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail) ||
    productIds.length < 1 ||
    productIds.length > 30
  ) {
    return NextResponse.json(
      { error: "Vui lòng nhập tên, email hợp lệ và chọn ít nhất một món." },
      { status: 400 },
    );
  }

  const order = await prisma.$transaction(async (transaction) => {
    const products = await transaction.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      select: { id: true, price: true },
    });

    if (products.length !== productIds.length) {
      return null;
    }

    const total = products.reduce((sum, product) => sum + product.price, 0);
    const createdOrder = await transaction.order.create({
      data: {
        buyerName,
        buyerEmail,
        total,
        items: {
          create: products.map((product) => ({
            productId: product.id,
            unitPrice: product.price,
          })),
        },
      },
      select: { id: true },
    });

    await transaction.product.updateMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      data: { status: "RESERVED" },
    });

    return createdOrder;
  });

  if (!order) {
    return NextResponse.json(
      { error: "Một món trong giỏ vừa có người đặt. Hãy cập nhật giỏ hàng rồi thử lại." },
      { status: 409 },
    );
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
