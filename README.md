# web_banhangtly — Lại Dùng

Chợ đồ cũ tuyển chọn bằng tiếng Việt, xây dựng với Next.js, TypeScript, Prisma và SQLite.

## Cài đặt và chạy trên Windows PowerShell

Yêu cầu Node.js 20 trở lên. Mở PowerShell tại thư mục `web_banhangtly`, sau đó chạy:

```powershell
npm install
Copy-Item .env.example .env
npm run db:setup
npm run dev
```

Mở `http://localhost:3000`. `db:setup` tạo cơ sở dữ liệu SQLite từ Prisma schema và nạp dữ liệu mẫu. Có thể chạy lại lệnh này; các món demo được cập nhật mà không xóa tin đăng hay đơn hàng.

## Tính năng

- Tìm sản phẩm, lọc danh mục và sắp xếp theo giá.
- Xem thông tin món đồ, người bán và tình trạng sử dụng.
- Thêm/bỏ món trong giỏ và đặt giữ hàng; đơn cùng tình trạng giữ được lưu trong SQLite.
- Đăng món mới với kiểm tra dữ liệu ở giao diện và API.
- Giao diện tương thích di động, có điều khiển bàn phím và hỗ trợ giảm chuyển động.

Đơn hàng/checkout hiện chỉ ghi nhận yêu cầu đặt giữ hàng (reservation); không thu hoặc xử lý thanh toán và cũng không gửi email tự động.

## Prisma và kiểm tra

- `prisma/schema.prisma`: schema danh mục, người bán, sản phẩm, đơn hàng và dòng đơn hàng.
- `prisma/seed.mjs`: dữ liệu mẫu danh mục, người bán và sản phẩm.
- `npm run db:studio`: mở Prisma Studio để xem dữ liệu.
- `npm run typecheck`: kiểm tra kiểu TypeScript.
- `npm run build`: tạo bản build production.

`DATABASE_URL` được đặt trong `.env`; file mẫu mặc định dùng SQLite tại `prisma/dev.db`. Cơ sở dữ liệu được tạo cục bộ khi chạy `npm run db:setup` và không nằm trong gói source này.
