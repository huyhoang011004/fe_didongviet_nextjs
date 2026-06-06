const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchShopCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchShopCategories error:', err);
    return null;
  }
}

export async function fetchShopProducts() {
  try {
    const res = await fetch(`${API_URL}/products?limit=100`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchShopProducts error:', err);
    return null;
  }
}

export async function fetchShopTradeIn() {
  try {
    const res = await fetch(`${API_URL}/products/trade-in`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchShopTradeIn error:', err);
    return null;
  }
}

export async function fetchShopBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs?limit=3`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchShopBlogs error:', err);
    return null;
  }
}

export async function fetchShopFlashSale() {
  try {
    const res = await fetch(`${API_URL}/flash-sales/current`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchShopFlashSale error:', err);
    return null;
  }
}
