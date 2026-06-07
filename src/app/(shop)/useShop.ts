import { useEffect, useState } from 'react';
import {
  fetchShopCategories,
  fetchShopProducts,
  fetchShopTradeIn,
  fetchShopBlogs,
  fetchShopFlashSale,
} from './shop-actions';

export function useShop() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tradeInProducts, setTradeInProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [flashSaleCampaign, setFlashSaleCampaign] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu từ backend
  useEffect(() => {
    async function loadHomepageData() {
      try {
        const [categoriesRes, productsRes, tradeInRes, blogsRes, flashSaleRes] =
          await Promise.all([
            fetchShopCategories(),
            fetchShopProducts(),
            fetchShopTradeIn(),
            fetchShopBlogs(),
            fetchShopFlashSale(),
          ]);

        if (categoriesRes && categoriesRes.success) {
          setCategories(categoriesRes.data || categoriesRes || []);
        }

        if (productsRes && productsRes.success) {
          const prods = productsRes.products || productsRes.data || [];
          setAllProducts(prods);
        }

        if (flashSaleRes && flashSaleRes.success && flashSaleRes.data) {
          setFlashSaleCampaign(flashSaleRes.data);
          setFlashSaleProducts(flashSaleRes.data.products || []);
        } else {
          setFlashSaleCampaign(null);
          setFlashSaleProducts([]);
        }

        if (tradeInRes && tradeInRes.success) {
          setTradeInProducts(tradeInRes.data || []);
        } else {
          // Fallback trade-in nếu trống
          const fallbackTrade = (
            productsRes?.products ||
            productsRes?.data ||
            []
          ).filter((p: any) => p.tradeInBonus > 0);
          setTradeInProducts(fallbackTrade);
        }

        if (blogsRes && blogsRes.success) {
          setBlogs(blogsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load shop homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, []);

  // PHÂN LOẠI SẢN PHẨM THEO DANH MỤC & THƯƠNG HIỆU
  const iphoneProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes('iphone'),
  );

  const samsungProducts = allProducts.filter(
    (p) => p.brand.toLowerCase() === 'samsung',
  );

  const oppoXiaomiProducts = allProducts.filter((p) => {
    const brand = p.brand?.toLowerCase() || '';
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';

    const isTargetBrand =
      brand === 'oppo' ||
      brand === 'xiaomi' ||
      brand === 'tecno' ||
      brand === 'realme' ||
      brand === 'honor';

    if (!isTargetBrand) return false;

    // Loại bỏ toàn bộ các sản phẩm không phải điện thoại
    const isExcluded =
      name.includes('robot') ||
      name.includes('lọc không khí') ||
      name.includes('loc khong khi') ||
      name.includes('hút bụi') ||
      name.includes('hut bui') ||
      name.includes('watch') ||
      name.includes('đồng hồ') ||
      name.includes('dong ho') ||
      name.includes('tai nghe') ||
      name.includes('loa') ||
      name.includes('cáp') ||
      name.includes('sạc') ||
      name.includes('chuột') ||
      name.includes('bàn phím') ||
      name.includes('tivi') ||
      name.includes('quạt') ||
      catName.includes('gia dụng') ||
      catName.includes('phụ kiện') ||
      catName.includes('âm thanh') ||
      catName.includes('đồng hồ') ||
      catSlug.includes('gia-dung') ||
      catSlug.includes('phu-kien') ||
      catSlug.includes('am-thanh') ||
      catSlug.includes('smartwatch');

    return !isExcluded;
  });

  const ipadTabletProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    return (
      catName.includes('tablet') ||
      catName.includes('ipad') ||
      catSlug.includes('tablet') ||
      catSlug.includes('ipad') ||
      name.includes('ipad') ||
      name.includes('tablet')
    );
  });

  const macbookLaptopProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    return (
      (catName.includes('laptop') ||
        catSlug.includes('laptop') ||
        name.includes('laptop') ||
        name.includes('macbook')) &&
      !catName.includes('tablet') &&
      !catName.includes('ipad') &&
      !name.includes('ipad') &&
      !name.includes('tablet')
    );
  });

  const usedProducts = allProducts.filter((p) => {
    const cond = p.condition?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      cond === 'cũ' ||
      cond === 'likenew' ||
      name.includes('cũ') ||
      catName.includes('cũ') ||
      catSlug.includes('cũ')
    );
  });

  const smartwatchProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('watch') ||
      catSlug.includes('smartwatch') ||
      catName.includes('đồng hồ') ||
      catName.includes('dong-ho') ||
      catSlug.includes('dong-ho-thong-minh')
    );
  });

  const accessoryProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('phụ kiện') ||
      catSlug.includes('phu-kien') ||
      catSlug.includes('cap-sac') ||
      catSlug.includes('cu-sac') ||
      catSlug.includes('pin-sac-du-phong')
    );
  });

  const audioProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('tai nghe') ||
      catName.includes('loa') ||
      catSlug.includes('am-thanh') ||
      catSlug.includes('audio') ||
      catSlug.includes('thiet-bi-am-thanh')
    );
  });

  const applianceProducts = allProducts.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('gia dụng') ||
      catSlug.includes('gia-dung') ||
      catName.includes('nồi') ||
      catName.includes('ấm') ||
      catName.includes('lọc')
    );
  });

  // Hàm helper lấy dự phòng (fallback) để test nếu db chưa đủ sản phẩm lọc
  const getFallbackList = (list: any[]) => {
    return list.length > 0 ? list : allProducts.slice(0, 5);
  };

  return {
    categories,
    tradeInProducts,
    flashSaleProducts,
    flashSaleCampaign,
    allProducts,
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
  };
}
