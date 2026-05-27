// app/(shop)/layout.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {/* Phần main bọc riêng nội dung của các trang mua sắm */}
      <main className='flex-1 overflow-x-hidden'>{children}</main>
      <Footer />
    </>
  );
}
