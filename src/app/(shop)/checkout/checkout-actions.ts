import { fetchVouchers, findVoucherByCode, calcVoucherValue, applyVoucherServer } from '../cart/cart-actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function loadCheckoutData(buyNow: boolean, productId?: string, variantId?: string, qty?: number) {
  try {
    const [profileRes, branchesRes, vouchersRes] = await Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch(`${API_URL}/branches`).then((r) => r.json()),
      fetchVouchers()
    ]);

    let buyNowItem = null;
    let productDetails = {};

    // Load buy now product if needed
    if (buyNow && productId) {
      const productRes = await fetch(`${API_URL}/products/${productId}`).then((r) => r.json());
      if (productRes && productRes.success && productRes.data) {
        const prod = productRes.data;
        const activeVariant = prod.variants?.find((v: any) => v._id === variantId) || prod.variants?.[0] || {};
        const rawThumb =
          activeVariant.variantImage ||
          prod.images?.find((img: any) => img.isThumbnail)?.url ||
          prod.images?.[0]?.url ||
          prod.imageUrl ||
          '/placeholder-product.png';

        buyNowItem = {
          product: prod._id,
          variant: activeVariant._id || 'default',
          name: prod.name,
          imageUrl: rawThumb.startsWith('http')
            ? rawThumb
            : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${rawThumb}`,
          quantity: qty || 1,
          price: activeVariant.price || prod.price || 0,
          salePrice: activeVariant.salePrice || activeVariant.price || prod.price || 0,
          selectedColor: activeVariant.color || '',
          selectedStorage: activeVariant.ram && activeVariant.rom
            ? `${activeVariant.ram}/${activeVariant.rom}`
            : activeVariant.storage || '',
          slug: prod.slug,
          categorySlug: prod.category?.slug || 'dien-thoai',
        };
        productDetails = { [prod._id]: prod };
      }
    }

    return {
      profile: profileRes.success && profileRes.data ? profileRes.data.user : null,
      branches: branchesRes && branchesRes.success ? (branchesRes.branches || branchesRes.data || []) : [],
      vouchers: vouchersRes || [],
      buyNowItem,
      productDetails,
    };
  } catch (err) {
    console.error('Failed to load checkout data', err);
    return {
      profile: null,
      branches: [],
      vouchers: [],
      buyNowItem: null,
      productDetails: {},
    };
  }
}

export async function loadProductDetails(productIds: string[]) {
  try {
    const detailsMap: Record<string, any> = {};

    await Promise.all(
      productIds.map(async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`).then((r) => r.json());
        if (res && res.success && res.data) {
          detailsMap[id] = res.data;
        }
      })
    );

    return detailsMap;
  } catch (err) {
    console.error('Failed to load product details for branch stock check:', err);
    return {};
  }
}

export async function applyVoucherCode(code: string, selectedTotalPrice: number) {
  try {
    const srv = await applyVoucherServer(code);
    
    if (srv.status === 200 && srv.data && srv.data.success) {
      const payload = srv.data.data || srv.data;
      return {
        success: true,
        voucher: { code: payload.voucherCode || code },
        discountAmount: payload.discountAmount || 0,
        message: 'Áp dụng mã thành công!',
      };
    }

    if (srv.status === 401) {
      const result = await findVoucherByCode(code, selectedTotalPrice);
      if (!result || !result.voucher) {
        return {
          success: false,
          message: 'Mã không hợp lệ hoặc đã hết hạn',
        };
      }
      if (!result.value || result.value <= 0) {
        return {
          success: false,
          message: 'Mã chưa đạt điều kiện áp dụng cho các sản phẩm đã chọn',
        };
      }
      return {
        success: true,
        voucher: result.voucher,
        discountAmount: result.value,
        message: 'Áp dụng mã (tạm tính) thành công!',
      };
    }

    return {
      success: false,
      message: srv.data?.message || 'Mã không hợp lệ hoặc đã hết hạn',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi khi kiểm tra mã giảm giá',
    };
  }
}

export async function placeOrder(payload: any) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi kết nối khi đặt hàng',
    };
  }
}

export { fetchVouchers, findVoucherByCode, calcVoucherValue, applyVoucherServer };
