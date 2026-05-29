// app/(shop)/layout.tsx
import Header from '@/app/(shop)/_components/layout/header';
import Footer from '@/app/(shop)/_components/layout/footer';

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
