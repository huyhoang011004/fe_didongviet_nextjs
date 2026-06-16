export async function fetchVouchers() {
    try {
        const res = await fetch('/api/vouchers');
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json?.data) ? json.data : json?.data || [];
    } catch (err) {
        return [];
    }
}

export function calcVoucherValue(v: any, total: number) {
    if (!v) return null;

    // Kiểm tra số lượt dùng của user
    const remainingUser = typeof v.remainingUserUsage === 'number' ? v.remainingUserUsage : (v.maxUsagePerUser - (v.userUsageCount || 0));
    if (remainingUser <= 0) return null;

    // Kiểm tra điều kiện đơn tối thiểu
    const minSpend = typeof v.minOrderAmount === 'number' ? v.minOrderAmount : (v.minSpend || 0);
    if (total < minSpend) return null;

    // Kiểm tra tổng lượt dùng còn lại
    const used = typeof v.usedCount === 'number' ? v.usedCount : 0;
    const limit = typeof v.usageLimit === 'number' ? v.usageLimit : Infinity;
    if (used >= limit) return null;

    // Tính toán số tiền được giảm theo phân loại
    if (v.discountType === 'fixed') {
        return typeof v.discountValue === 'number' ? v.discountValue : (v.amount || v.discountAmount || 0);
    }

    if (v.discountType === 'percentage') {
        const percent = typeof v.discountValue === 'number' ? v.discountValue : (v.percent || 0);
        let val = Math.floor(total * (percent / 100));

        const maxDisc = typeof v.maxDiscount === 'number' ? v.maxDiscount : v.maxAmount;
        if (typeof maxDisc === 'number') val = Math.min(val, maxDisc);
        return val;
    }

    // Tương thích ngược với định dạng cũ
    if (typeof v.amount === 'number') return v.amount;
    if (typeof v.discountAmount === 'number') return v.discountAmount;
    if (typeof v.discountValue === 'number') return v.discountValue;
    return 0;
}

export async function findVoucherByCode(code: string, total: number) {
    const list = await fetchVouchers();
    const upper = code.toUpperCase();
    const v = list.find((x: any) => String(x.code).toUpperCase() === upper);
    if (!v) return null;
    const value = calcVoucherValue(v, total);
    return { voucher: v, value };
}

export async function applyVoucherServer(code: string) {
    try {
        const res = await fetch('/api/cart/apply-voucher', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voucherCode: code }),
        });
        const json = await res.json();
        return { status: res.status, data: json };
    } catch (err) {
        return { status: 500, data: { success: false, message: 'Lỗi khi gọi server' } };
    }
}
