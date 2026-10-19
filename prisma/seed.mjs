import { PrismaClient, ProductCondition } from "@prisma/client";

const prisma = new PrismaClient();

const sellers = [
  { id: "demo-seller-1", name: "Minh Anh", location: "Cầu Giấy, Hà Nội" },
  { id: "demo-seller-2", name: "Hoàng Nam", location: "Thanh Xuân, Hà Nội" },
  { id: "demo-seller-3", name: "Hà My", location: "Bình Thạnh, TP. Hồ Chí Minh" },
  { id: "demo-seller-4", name: "Tuấn Khang", location: "Thủ Đức, TP. Hồ Chí Minh" },
];

const categories = [
  { id: "demo-category-1", name: "Nội thất", slug: "noi-that", icon: "chair" },
  { id: "demo-category-2", name: "Điện tử", slug: "dien-tu", icon: "spark" },
  { id: "demo-category-3", name: "Thời trang", slug: "thoi-trang", icon: "hanger" },
  { id: "demo-category-4", name: "Đồ gia dụng", slug: "do-gia-dung", icon: "home" },
  { id: "demo-category-5", name: "Sách & đồ khác", slug: "sach-do-khac", icon: "book" },
];

const products = [
  {
    name: "Ghế lounge Mây",
    category: "noi-that",
    price: 890000,
    originalPrice: 1650000,
    condition: ProductCondition.GOOD,
    description: "Khung gỗ chắc chắn, đệm còn êm. Một vết xước nhỏ ở chân ghế, không ảnh hưởng sử dụng.",
    location: "Cầu Giấy, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",
    seller: 0,
    isFeatured: true,
  },
  {
    name: "Đèn bàn Gốm",
    category: "do-gia-dung",
    price: 320000,
    originalPrice: 590000,
    condition: ProductCondition.LIKE_NEW,
    description: "Đèn ánh sáng vàng dịu, chụp vải màu kem và chân gốm thủ công. Đã bao gồm bóng LED.",
    location: "Thanh Xuân, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    seller: 1,
    isFeatured: true,
  },
  {
    name: "Máy ảnh film nhỏ",
    category: "dien-tu",
    price: 1250000,
    originalPrice: 2100000,
    condition: ProductCondition.GOOD,
    description: "Đã lên film và chụp thử bình thường. Có dây đeo nguyên bản, tặng kèm cuộn film đang dùng.",
    location: "Bình Thạnh, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    seller: 2,
    isFeatured: true,
  },
  {
    name: "Loa Bluetooth gỗ",
    category: "dien-tu",
    price: 740000,
    originalPrice: 1190000,
    condition: ProductCondition.GOOD,
    description: "Âm thanh ấm, pin dùng khoảng 6 tiếng. Vỏ có vài dấu sử dụng nhẹ ở mặt sau.",
    location: "Thủ Đức, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
    seller: 3,
    isFeatured: false,
  },
  {
    name: "Bàn làm việc gỗ sồi",
    category: "noi-that",
    price: 1450000,
    originalPrice: 2800000,
    condition: ProductCondition.GOOD,
    description: "Mặt bàn rộng 120 cm, đã tháo chân để tiện vận chuyển. Người mua có thể xem trực tiếp.",
    location: "Cầu Giấy, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85",
    seller: 0,
    isFeatured: false,
  },
  {
    name: "Bình giữ nhiệt Kinto",
    category: "do-gia-dung",
    price: 280000,
    originalPrice: 460000,
    condition: ProductCondition.LIKE_NEW,
    description: "Dung tích 500 ml, giữ nhiệt tốt. Đã vệ sinh kỹ, không móp méo hay trầy xước.",
    location: "Thanh Xuân, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",
    seller: 1,
    isFeatured: false,
  },
  {
    name: "Túi da mini nâu",
    category: "thoi-trang",
    price: 530000,
    originalPrice: 980000,
    condition: ProductCondition.GOOD,
    description: "Túi da mềm, khoá kéo hoạt động tốt. Kích thước vừa điện thoại, ví và sổ nhỏ.",
    location: "Bình Thạnh, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    seller: 2,
    isFeatured: false,
  },
  {
    name: "Xe đạp city xanh",
    category: "do-gia-dung",
    price: 1690000,
    originalPrice: 3200000,
    condition: ProductCondition.FAIR,
    description: "Xe đi làm hằng ngày, phanh và lốp vừa bảo dưỡng. Sơn có vài chỗ tróc nhỏ như ảnh.",
    location: "Thủ Đức, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85",
    seller: 3,
    isFeatured: false,
  },
  {
    name: "Sách thiết kế tuyển chọn",
    category: "sach-do-khac",
    price: 190000,
    originalPrice: 360000,
    condition: ProductCondition.GOOD,
    description: "Sách còn nguyên vẹn, gáy thẳng, không ghi chú. Hợp với người mê typography và màu sắc.",
    location: "Cầu Giấy, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    seller: 0,
    isFeatured: false,
  },
  {
    name: "Máy xay sinh tố mini",
    category: "do-gia-dung",
    price: 410000,
    originalPrice: 750000,
    condition: ProductCondition.GOOD,
    description: "Cối thủy tinh dung tích 600 ml, lưỡi dao sắc và máy chạy êm. Đủ nắp và dây nguồn.",
    location: "Thanh Xuân, Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=85",
    seller: 1,
    isFeatured: false,
  },
  {
    name: "Giày chạy bộ trắng",
    category: "thoi-trang",
    price: 460000,
    originalPrice: 1290000,
    condition: ProductCondition.FAIR,
    description: "Size 38, đế còn tốt, phù hợp đi hằng ngày. Giày đã được giặt sạch trước khi đăng.",
    location: "Bình Thạnh, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    seller: 2,
    isFeatured: false,
  },
  {
    name: "Ghế gỗ xếp gọn",
    category: "noi-that",
    price: 390000,
    originalPrice: 720000,
    condition: ProductCondition.GOOD,
    description: "Gấp gọn cất dễ dàng, khung gỗ chắc và không cập kênh. Có thể dùng trong nhà hoặc ban công.",
    location: "Thủ Đức, TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=900&q=85",
    seller: 3,
    isFeatured: false,
  },
];

async function main() {
  const createdSellers = await Promise.all(
    sellers.map(({ id, ...data }) =>
      prisma.seller.upsert({ where: { id }, create: { id, ...data }, update: data }),
    ),
  );
  const createdCategories = await Promise.all(
    categories.map(({ id, ...data }) =>
      prisma.category.upsert({ where: { slug: data.slug }, create: { id, ...data }, update: data }),
    ),
  );
  const categoryIds = new Map(createdCategories.map((category) => [category.slug, category.id]));

  for (const [index, product] of products.entries()) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) {
      throw new Error(`Unknown category: ${product.category}`);
    }

    const data = {
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        condition: product.condition,
        location: product.location,
        imageUrl: product.imageUrl,
        sellerId: createdSellers[product.seller].id,
        categoryId,
        isFeatured: product.isFeatured ?? false,
      };
    const id = `demo-product-${String(index + 1).padStart(2, "0")}`;
    await prisma.product.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
