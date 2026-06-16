'use client';

import CategoriesSection from './_components/page/CategoriesSection';
import FlashSaleSection from './_components/page/FlashSaleSection';
import ProductSection from './_components/page/ProductSection';
import CustomerGallery from './_components/page/CustomerGallery';
import BlogSection from './_components/page/BlogSection';
import TradeInSection from './_components/page/TradeInSection';
import {
  HorizontalBanner,
  GridBanners,
  PartnerLogos,
} from './_components/page/PromoBanners';
import { useShop } from './useShop';

export default function ShopHomepage() {
  const {
    categories,
    tradeInProducts,
    flashSaleProducts,
    flashSaleCampaign,
    blogs,
    loading,
    iphoneProducts,
    samsungProducts,
    oppoXiaomiProducts,
    ipadTabletProducts,
    macbookLaptopProducts,
    usedProducts,
    smartwatchProducts,
    accessoryProducts,
    audioProducts,
    applianceProducts,
    getFallbackList,
    allProducts,
  } = useShop();

  return (
    <div className='min-h-screen bg-slate-50 font-sans pb-12 space-y-6'>
      {/* ─── 1. HERO BANNER & SLIDER ─── */}
      <CategoriesSection categories={categories} allProducts={allProducts} />

      <div className='max-w-[1400px] mx-auto px-[30px] space-y-8 py-2'>

        {/* ─── 3. BANNER NGANG KHUYẾN MÃI LỚN ─── */}
        <HorizontalBanner />

        {/* ─── 4. KHUNG FLASH SALE ĐỎ RỰC RỠ ─── */}
        <FlashSaleSection
          loading={loading}
          flashSaleCampaign={flashSaleCampaign}
          flashSaleProducts={flashSaleProducts}
        />

        {/* ─── SECTION SẢN PHẨM: THU CŨ ĐỔI MỚI ─── */}
        <TradeInSection loading={loading} tradeInProducts={tradeInProducts} />

        {/* ─── 5. SECTION SẢN PHẨM: IPHONE ─── */}
        <ProductSection
          title='iPhone Chính Hãng'
          products={getFallbackList(iphoneProducts)}
          loading={loading}
          themeColor='red'
          viewAllLink='/category/dien-thoai'
          tabs={[
            'Xem tất cả',
            'iPhone 16 Pro Max',
            'iPhone 16 Pro',
            'iPhone 16 Plus',
            'iPhone 16',
          ]}
        />

        {/* ─── 6. SECTION SẢN PHẨM: SAMSUNG GALAXY ─── */}
        <ProductSection
          title='Samsung Galaxy Chính Hãng'
          products={getFallbackList(samsungProducts)}
          loading={loading}
          themeColor='blue'
          viewAllLink='/category/dien-thoai'
          tabs={[
            'Xem tất cả',
            'Galaxy S Series',
            'Galaxy Z Series',
            'Galaxy A Series',
          ]}
        />

        {/* ─── SECTION SẢN PHẨM: OPPO, XIAOMI, TECNO, REALME, HONOR ─── */}
        <ProductSection
          title='OPPO | Xiaomi | TECNO | realme | HONOR Chính Hãng'
          products={oppoXiaomiProducts}
          loading={loading}
          themeColor='purple'
          viewAllLink='/category/dien-thoai'
          tabs={['Xem tất cả', 'OPPO', 'Xiaomi', 'TECNO', 'Realme', 'Honor']}
        />

        {/* ─── SECTION SẢN PHẨM: IPAD & TABLET ─── */}
        <ProductSection
          title='iPad & Tablet'
          products={getFallbackList(ipadTabletProducts)}
          loading={loading}
          themeColor='blue'
          viewAllLink='/category/ipad'
          tabs={['Xem tất cả', 'iPad', 'Samsung Tab', 'Xiaomi Pad']}
        />

        {/* ─── SECTION SẢN PHẨM: MACBOOK & LAPTOP ─── */}
        <ProductSection
          title='Macbook & Laptop'
          products={getFallbackList(macbookLaptopProducts)}
          loading={loading}
          themeColor='slate'
          viewAllLink='/category/laptop'
          tabs={['Xem tất cả', 'MacBook', 'Asus', 'HP', 'Dell', 'Lenovo']}
        />

        {/* ─── LƯỚI 4 BANNER ĐẶC QUYỀN ─── */}
        <GridBanners />

        {/* ─── BANNER NGANG XEN KẼ ─── */}
        <HorizontalBanner />

        {/* ─── SECTION SẢN PHẨM: MÁY CŨ GIÁ RẺ ─── */}
        <ProductSection
          title='Máy cũ giá rẻ'
          products={getFallbackList(usedProducts)}
          loading={loading}
          themeColor='red'
          viewAllLink='/category/dien-thoai-cu'
          tabs={[
            'Xem tất cả',
            'Điện thoại',
            'iPad & Tablet',
            'Macbook & Laptop',
          ]}
        />

        {/* ─── KHỐI THƯ VIỆN ẢNH KHÁCH HÀNG ─── */}
        <CustomerGallery />

        {/* ─── SECTION SẢN PHẨM: PHỤ KIỆN CÔNG NGHỆ ─── */}
        <ProductSection
          title='Phụ kiện công nghệ chính hãng'
          products={getFallbackList(accessoryProducts)}
          loading={loading}
          themeColor='purple'
          viewAllLink='/category/phu-kien'
          tabs={['Xem tất cả', 'Cáp sạc', 'Củ sạc', 'Pin sạc dự phòng']}
        />

        {/* ─── SECTION SẢN PHẨM: SMARTWATCH ─── */}
        <ProductSection
          title='Smartwatch - Đồng hồ thông minh'
          products={getFallbackList(smartwatchProducts)}
          loading={loading}
          themeColor='amber'
          viewAllLink='/category/smartwatch'
          tabs={['Xem tất cả', 'Apple Watch', 'Galaxy Watch', 'Huawei Watch']}
        />

        {/* ─── SECTION SẢN PHẨM: TAI NGHE & ÂM THANH ─── */}
        <ProductSection
          title='Âm thanh - Loa & Tai nghe'
          products={getFallbackList(audioProducts)}
          loading={loading}
          themeColor='blue'
          viewAllLink='/category/phu-kien'
          tabs={['Xem tất cả', 'AirPods', 'Tai nghe Bluetooth', 'Loa Bluetooth']}
        />

        {/* ─── SECTION SẢN PHẨM: GIA DỤNG THÔNG MINH ─── */}
        <ProductSection
          title='Gia dụng thông minh & Đời sống'
          products={getFallbackList(applianceProducts)}
          loading={loading}
          themeColor='amber'
          viewAllLink='/category/voucher'
          tabs={['Xem tất cả', 'Philips', 'Xiaomi', 'Bear']}
        />

        {/* ─── TIN TỨC CÔNG NGHỆ ─── */}
        <BlogSection loading={loading} blogs={blogs} />

        {/* ─── LOGO ĐỐI TÁC THƯƠNG HIỆU LIÊN KẾT ─── */}
        <PartnerLogos />
      </div>
    </div>
  );
}
