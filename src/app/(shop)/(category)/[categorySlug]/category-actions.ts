const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchCategoryInfo(slug: string) {
  try {
    const res = await fetch(`${API_URL}/categories/slug/${slug}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchCategoryInfo error:', err);
    return null;
  }
}

export async function fetchCategoryProducts(
  slug: string,
  page: number,
  limit: number,
  brand: string,
  sort: string
) {
  try {
    const url = `${API_URL}/products/category/${slug}?page=${page}&limit=${limit}&brand=${brand}&sort=${sort}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchCategoryProducts error:', err);
    return null;
  }
}

export async function fetchAllProductsForBrands(slug: string) {
  try {
    const url = `${API_URL}/products/category/${slug}?limit=100`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchAllProductsForBrands error:', err);
    return null;
  }
}
