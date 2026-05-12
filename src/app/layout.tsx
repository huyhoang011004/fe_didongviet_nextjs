import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Cấu hình Font chữ
const inter = Inter({
  subsets: ["vietnamese"],
  variable: "--font-inter",
});

// Cấu hình SEO Metadata chuẩn Di Động Việt
export const metadata: Metadata = {
  title: "Di Động Việt - Điện thoại, MacBook, Tablet, Phụ kiện giá tốt",
  description: "Hệ thống bán lẻ điện thoại di động, máy tính bảng, MacBook, phụ kiện chính hãng tại Di Động Việt. Chuyển giao giá trị vượt trội.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body className="antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        {/* Header xuất hiện ở trên cùng của mọi trang */}
        <Header />

        {/* Phần main sẽ chứa nội dung thay đổi của từng trang (page.tsx).
            flex-1 giúp đẩy Footer xuống cuối trang nếu nội dung quá ngắn.
        */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* Footer xuất hiện ở dưới cùng của mọi trang */}
        <Footer />
      </body>
    </html>
  );
}