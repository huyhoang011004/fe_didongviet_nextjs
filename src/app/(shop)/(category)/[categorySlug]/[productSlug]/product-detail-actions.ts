const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchProductDetail(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchProductDetail error:', err);
    return null;
  }
}

export async function fetchBranches() {
  try {
    const res = await fetch(`${API_URL}/branches`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchBranches error:', err);
    return null;
  }
}

export async function fetchRelatedProducts(productId: string, limit: number = 10, isUsed?: boolean, exclude: string[] = []) {
  try {
    const excludeStr = exclude.join(',');
    const url = `${API_URL}/products/${productId}/related?limit=${limit}` + 
      (isUsed !== undefined ? `&isUsed=${isUsed}` : '') + 
      (excludeStr ? `&exclude=${excludeStr}` : '');
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchRelatedProducts error:', err);
    return null;
  }
}

export async function fetchProductReviews(productId: string, page: number = 1, limit: number = 5) {
  try {
    const res = await fetch(`${API_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchProductReviews error:', err);
    return null;
  }
}

export async function fetchProductNews(productId: string, limit: number = 4) {
  try {
    const res = await fetch(`${API_URL}/blogs?related=${productId}&limit=${limit}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('fetchProductNews error:', err);
    return null;
  }
}
