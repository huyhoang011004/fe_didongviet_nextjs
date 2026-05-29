export async function getCurrentUser() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.user) {
        return data.data.user;
      }
    }
    return null;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}
