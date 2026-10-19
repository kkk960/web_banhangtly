export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export const conditionLabels = {
  LIKE_NEW: "Như mới",
  GOOD: "Đẹp",
  FAIR: "Có dấu dùng",
} as const;
