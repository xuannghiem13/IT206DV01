# HỆ THỐNG WEB QUẢN LÝ CĂN HỘ DỊCH VỤ & PHÒNG TRỌ (HSU)

Dự án được xây dựng trên nền tảng **Next.js 15 (App Router, TypeScript, Tailwind CSS)**, hỗ trợ triển khai 1-click lên **Vercel** và kết nối trực tiếp với **Cơ sở dữ liệu SQL** (Microsoft SQL Server 2019 cục bộ và PostgreSQL/Neon trên Cloud).

---

## 🌟 5 Nhóm Tác Nhân & Phân Quyền (Theo Request.txt)

1. 👑 **Chủ trọ (Owner)**:
   - Quản trị tổng quan khu căn hộ, tỷ lệ lấp đầy.
   - Xem báo cáo doanh thu dự kiến, số tiền đã thu, công nợ tồn đọng.
   - Thiết lập biểu giá điện, nước, dịch vụ.
2. 🏢 **Bộ phận Quản lý (Manager)**:
   - Quản lý sơ đồ phòng (Trống / Đang thuê / Đang sửa chữa).
   - Quản lý hồ sơ khách thuê và hợp đồng thuê căn hộ.
   - Chốt chỉ số điện & nước định kỳ từng phòng (tự động tính mức tiêu thụ và lập hóa đơn).
   - Điều phối tiếp nhận sự cố kỹ thuật từ khách thuê.
3. 🔧 **Bộ phận Kỹ thuật (Technician)**:
   - Tiếp nhận sự cố (Điện, Nước, Điều hòa, Thiết bị gia dụng...).
   - Cập nhật tiến độ xử lý và nghiệm thu kỹ thuật.
   - Ghi nhận linh kiện thay thế và chi phí sửa chữa.
4. 📊 **Bộ phận Kế toán (Accountant)**:
   - Quản lý danh mục hóa đơn tiền phòng và dịch vụ hàng tháng.
   - Tích hợp mã **VietQR** động (chuẩn NAPAS 24/7) theo đúng số tiền và cú pháp phòng.
   - Thu tiền mặt hoặc xác nhận chuyển khoản ngân hàng, quản lý công nợ.
5. 👥 **Bộ phận Nhân sự (HR)**:
   - Quản lý danh bạ hồ sơ nhân viên, chức vụ, bộ phận.
   - Điểm danh và phân công ca trực hàng ngày.
6. 🏠 **Cổng Khách thuê (Tenant Portal)**:
   - Tra cứu tiền phòng, chỉ số điện nước đã dùng.
   - Quét mã VietQR thanh toán nhanh từ App ngân hàng.
   - Gửi yêu cầu sửa chữa hỏng hóc thiết bị trực tuyến.

---

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu SQL

Dự án đã chuẩn bị sẵn các script DDL trong thư mục `sql/`:
- `sql/schema_mssql.sql`: Tạo toàn bộ 14 bảng quan hệ trên **Microsoft SQL Server 2019** (`QuanLyCanHoDichVu`).
- `sql/seed_data_mssql.sql`: Nạp sẵn dữ liệu mẫu thực tế cho các phòng (101, 102, 103, 201...), nhân viên, hợp đồng và hóa đơn.
- `sql/schema_postgres.sql`: Bản DDL tương thích cho **PostgreSQL / Vercel Postgres / Neon** khi đưa lên Cloud.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

1. Mở terminal tại thư mục dự án:
   ```bash
   cd g:\HSU\apartment-web
   ```

2. Cài đặt các gói phụ thuộc (nếu chưa cài):
   ```bash
   npm install
   ```

3. Khởi chạy máy chủ phát triển Next.js:
   ```bash
   npm run dev
   ```

4. Truy cập trình duyệt tại địa chỉ:
   ```
   http://localhost:3000
   ```

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel (Vercel App)

1. **Cách 1: Đẩy mã nguồn lên GitHub**:
   - Đưa thư mục `apartment-web` lên repository GitHub của bạn.
   - Truy cập [vercel.com](https://vercel.com) và chọn **Add New Project**.
   - Chọn repository và nhấn **Deploy**.

2. **Cách 2: Triển khai trực tiếp bằng Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Kết nối SQL trên Vercel**:
   - Trong giao diện Vercel Dashboard của dự án, vào tab **Storage** -> tạo **Postgres** (hoặc Neon Database miễn phí).
   - Chạy các lệnh trong file `sql/schema_postgres.sql` trên query console của Vercel Postgres.
   - Vercel sẽ tự động cung cấp biến môi trường `DATABASE_URL` và kết nối liền mạch!
