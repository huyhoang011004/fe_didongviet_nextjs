import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

// Cấu hình Font chữ
const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
});

// Cấu hình SEO Metadata chuẩn Di Động Việt
export const metadata: Metadata = {
  title: 'Di Động Việt - Điện thoại, MacBook, Tablet, Phụ kiện giá tốt',
  description:
    'Hệ thống bán lẻ điện thoại di động, máy tính bảng, MacBook, phụ kiện chính hãng tại Di Động Việt. Chuyển giao giá trị vượt trội.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi' className={`${inter.variable}`}>
      <body className='antialiased bg-white text-gray-900 min-h-screen flex flex-col'>
        {children}
      </body>
    </html>
  );
}
