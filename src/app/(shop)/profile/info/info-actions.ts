export async function updateProfile(payload: { name: string; phone: string; address: any[]; avatar?: string }) {
  const res = await fetch('/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Cập nhật hồ sơ thất bại');
  }
  return res.json();
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  const res = await fetch('/api/auth/change-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Mật khẩu cũ không chính xác!');
  }
  return res.json();
}
