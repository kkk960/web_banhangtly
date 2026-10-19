import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lại Dùng — Đồ tốt tìm chủ mới",
  description:
    "Chợ đồ cũ tuyển chọn. Tìm những món đồ còn tốt, giá dễ chịu và đăng bán đồ bạn không còn dùng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
