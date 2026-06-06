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
      <main className='flex-1 overflow-x-hidden pt-[100px] md:pt-[110px]'>
        {children}
      </main>
      <Footer />
    </>
  );
}
