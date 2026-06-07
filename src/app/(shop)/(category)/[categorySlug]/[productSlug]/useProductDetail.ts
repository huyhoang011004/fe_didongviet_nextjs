import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProductDetail, fetchBranches, fetchRelatedProducts } from './product-detail-actions';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function getImageUrl(url: string | undefined | null): string {
  if (!url) return '/placeholder-product.png';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

export function useProductDetail(id: string) {
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        const [productRes, branchesRes] = await Promise.all([
          fetchProductDetail(id),
          fetchBranches(),
        ]);

        if (productRes && productRes.success) {
          const prod = productRes.data;
          setProduct(prod);

          const rawThumb =
            prod.images?.find((img: any) => img.isThumbnail)?.url ||
            prod.images?.[0]?.url ||
            prod.imageUrl ||
            '';
          setActiveImage(getImageUrl(rawThumb));

          const relatedRes = await fetchRelatedProducts(prod._id);
          if (relatedRes && relatedRes.success) {
            setRelatedProducts(relatedRes.data || []);
          }
        }

        if (branchesRes && branchesRes.success) {
          setBranches(branchesRes.branches || branchesRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.variants || product.variants.length === 0) return false;

    const activeVariant = product.variants[selectedVariantIdx];
    if (!activeVariant) return false;

    setIsAddingToCart(true);
    try {
      const rawThumb =
        activeVariant.variantImage ||
        product.images?.find((img: any) => img.isThumbnail)?.url ||
        product.images?.[0]?.url ||
        product.imageUrl ||
        '/placeholder-product.png';

      const newItem = {
        product: product._id,
        variant: activeVariant._id,
        name: product.name,
        imageUrl: rawThumb.startsWith('http')
          ? rawThumb
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${rawThumb}`,
        quantity: cartQty,
        price: activeVariant.price,
        salePrice: activeVariant.salePrice || activeVariant.price,
        selectedColor: activeVariant.color,
        selectedStorage: activeVariant.ram && activeVariant.rom
          ? `${activeVariant.ram}/${activeVariant.rom}`
          : activeVariant.storage || '',
        slug: product.slug,
        categorySlug: product.category?.slug || 'dien-thoai',
      };

      const success = await useCartStore.getState().addItem(newItem);
      if (success) {
        setAlert({
          type: 'success',
          message: `Đã thêm ${cartQty} sản phẩm vào giỏ hàng!`,
        });
        return true;
      } else {
        setAlert({
          type: 'error',
          message: 'Không thể thêm vào giỏ hàng',
        });
        return false;
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi thêm vào giỏ hàng' });
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !product.variants || product.variants.length === 0) return;

    const activeVariant = product.variants[selectedVariantIdx];
    if (!activeVariant) return;

    setIsBuyingNow(true);
    try {
      router.push(`/checkout?buyNow=true&productId=${product._id}&variantId=${activeVariant._id}&qty=${cartQty}`);
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi tiến hành mua ngay' });
    } finally {
      setIsBuyingNow(false);
    }
  };

  return {
    product,
    relatedProducts,
    branches,
    loading,
    selectedVariantIdx,
    setSelectedVariantIdx,
    activeImage,
    setActiveImage,
    isLiked,
    setIsLiked,
    isDescExpanded,
    setIsDescExpanded,
    cartQty,
    setCartQty,
    isAddingToCart,
    isBuyingNow,
    alert,
    setAlert,
    handleAddToCart,
    handleBuyNow,
  };
}
