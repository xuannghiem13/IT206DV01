import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quản lý Căn hộ Dịch vụ & Phòng trọ | HSU Serviced Apartments",
  description: "Hệ thống quản lý căn hộ dịch vụ, phân quyền 5 bộ phận và khách thuê, quản lý điện nước, hóa đơn VietQR.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
