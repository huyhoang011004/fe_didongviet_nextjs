// ==================== IMPORT ====================
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Cache dữ liệu sản phẩm (refresh mỗi 5 phút)
let productsCache: any[] = [];
let blogsCache: any[] = [];
let lastFetchProducts = 0;
let lastFetchBlogs = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

// ==================== Fetch dữ liệu thật từ Database (có cache) ====================

async function getProductsFromDB(): Promise<any[]> {
    const now = Date.now();
    if (productsCache.length > 0 && now - lastFetchProducts < CACHE_TTL) {
        return productsCache;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/products?limit=200&isActive=true`, {
            signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        const list = data.products || data.data || [];
        if (Array.isArray(list) && list.length > 0) {
            productsCache = list;
            lastFetchProducts = now;
        }
        return productsCache;
    } catch (e) {
        console.error('Fetch products error:', e);
        return productsCache;
    }
}

async function getBlogsFromDB(): Promise<any[]> {
    const now = Date.now();
    if (blogsCache.length > 0 && now - lastFetchBlogs < CACHE_TTL) {
        return blogsCache;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/blogs?limit=10`, {
            signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        const list = data.blogs || data.data || [];
        if (Array.isArray(list) && list.length > 0) {
            blogsCache = list;
            lastFetchBlogs = now;
        }
        return blogsCache;
    } catch (e) {
        console.error('Fetch blogs error:', e);
        return blogsCache;
    }
}

// Format giá
function formatPrice(p: any): string {
    const variants = p.variants || [];
    const price = p.priceRange?.min || variants[0]?.salePrice || variants[0]?.price || 0;
    return price ? new Intl.NumberFormat('vi-VN').format(Number(price)) + 'đ' : 'Liên hệ';
}

// Tìm sản phẩm theo brand
function filterByBrand(products: any[], brand: string): any[] {
    const b = brand.toLowerCase();
    return products.filter((p: any) => {
        const name = (p.name || '').toLowerCase();
        const pBrand = (p.brand || '').toLowerCase();
        return name.includes(b) || pBrand.includes(b);
    });
}

// Tìm sản phẩm theo khoảng giá
function filterByPrice(products: any[], min: number | null, max: number | null): any[] {
    return products.filter((p: any) => {
        const variants = p.variants || [];
        const price = p.priceRange?.min || variants[0]?.salePrice || variants[0]?.price || 0;
        const pVal = Number(price);
        if (!pVal) return false;
        if (min && pVal < min) return false;
        if (max && pVal > max) return false;
        return true;
    });
}

// Tìm sản phẩm theo tính năng (dựa vào tên sản phẩm và brand)
function filterByFeature(products: any[], feature: string): any[] {
    const cameraBrands = ['iPhone', 'Samsung', 'Google'];
    const gamingBrands = ['Asus', 'ROG', 'Redmi', 'Poco', 'Black Shark'];
    const batteryKeywords = ['M', 'A', 'battery', 'pin'];
    const cheapThreshold = 5000000;

    switch (feature) {
        case 'camera':
            return products.filter((p: any) => {
                const name = (p.name || '').toLowerCase();
                const brand = (p.brand || '').toLowerCase();
                return cameraBrands.some(b => brand.includes(b.toLowerCase())) ||
                    name.includes('pro') || name.includes('ultra');
            });
        case 'gaming':
            return products.filter((p: any) => {
                const brand = (p.brand || '').toLowerCase();
                const name = (p.name || '').toLowerCase();
                return gamingBrands.some(b => name.includes(b.toLowerCase()) || brand.includes(b.toLowerCase())) ||
                    name.includes('gaming') || brand.includes('snapdragon');
            });
        case 'battery':
            return products.filter((p: any) => {
                const name = (p.name || '').toLowerCase();
                return batteryKeywords.some(k => name.includes(k.toLowerCase()));
            });
        case 'student':
        case 'cheap':
            return products.filter((p: any) => {
                const variants = p.variants || [];
                const price = p.priceRange?.min || variants[0]?.salePrice || variants[0]?.price || 0;
                return Number(price) <= cheapThreshold;
            });
        default:
            return products;
    }
}

// ==================== FAQ ====================
const FAQS: Record<string, { reply: string }> = {
    warranty: {
        reply:
            '📜 **Chính sách bảo hành tại Di Động Việt:**\n\n' +
            '• Thời gian bảo hành: **12 tháng** cho máy mới, **6 tháng** cho máy cũ.\n' +
            '• **Lỗi 1 đổi 1** trong 30 ngày đầu nếu lỗi từ nhà sản xuất.\n' +
            '• Bảo hành tại tất cả chi nhánh Di Động Việt trên toàn quốc.\n' +
            '• Miễn phí bảo hành, miễn phí vận chuyển khi bảo hành.\n\n' +
            '👉 Bạn cần hỗ trợ thêm gì không ạ?',
    },
    address: {
        reply:
            '📍 **Hệ thống cửa hàng Di Động Việt:**\n\n' +
            '🏪 **Chi nhánh 1:** 123 Nguyễn Huệ, Quận 1, TP.HCM\n' +
            '🏪 **Chi nhánh 2:** 456 Lê Lợi, Quận Bình Thạnh, TP.HCM\n' +
            '🏪 **Chi nhánh 3:** 789 Nguyễn Văn Linh, Quận 7, TP.HCM\n\n' +
            '⏰ Giờ mở cửa: 8:00 - 21:30 (T2 - CN)\n\n' +
            '👉 Bạn muốn đến chi nhánh nào gần nhất ạ?',
    },
    shipping: {
        reply:
            '🚚 **Chính sách vận chuyển:**\n\n' +
            '• **Giao hàng COD** toàn quốc (Nhận hàng - Kiểm tra - Thanh toán).\n' +
            '• **Miễn phí ship** cho đơn hàng trên 5 triệu (nội thành).\n' +
            '• Thời gian giao hàng:\n' +
            '   - Nội thành TP.HCM: **1-2 giờ** (giao hỏa tốc).\n' +
            '   - Nội tỉnh: **1-2 ngày** làm việc.\n' +
            '   - Ngoại tỉnh: **2-4 ngày** làm việc.\n\n' +
            '👉 Bạn muốn đặt hàng ngay không ạ?',
    },
};

function checkFAQ(message: string) {
    const msg = message.toLowerCase();
    if (/bảo hành|đổi trả|1 đổi 1|bao hành|lỗi|hỏng|sửa chữa|bảo trì/i.test(msg))
        return { intent: 'FAQ', faq_type: 'warranty', reply: FAQS.warranty.reply, filters: { brand: null, price_min: null, price_max: null, feature: null }, suggested_buttons: ['Mua điện thoại', 'Địa chỉ cửa hàng', 'Vận chuyển', 'Gặp nhân viên'] };
    if (/địa chỉ|cửa hàng|chi nhánh|ở đâu|đến.*mua|đường.*tới|map|bản đồ/i.test(msg))
        return { intent: 'FAQ', faq_type: 'address', reply: FAQS.address.reply, filters: { brand: null, price_min: null, price_max: null, feature: null }, suggested_buttons: ['Mua điện thoại', 'Bảo hành', 'Vận chuyển', 'Gặp nhân viên'] };
    if (/vận chuyển|ship|giao hàng|cod|vận chuyễn|phí ship|bao lâu.*nhận|khi nào.*đến/i.test(msg))
        return { intent: 'FAQ', faq_type: 'shipping', reply: FAQS.shipping.reply, filters: { brand: null, price_min: null, price_max: null, feature: null }, suggested_buttons: ['Mua điện thoại', 'Địa chỉ cửa hàng', 'Bảo hành', 'Gặp nhân viên'] };
    return null;
}

// ==================== Engine chính ====================

const BRANDS = ['iphone', 'apple', 'samsung', 'oppo', 'xiaomi', 'realme', 'nokia', 'huawei', 'honor', 'sony', 'asus', 'dell', 'hp', 'lenovo', 'macbook', 'google', 'oneplus', 'nothing', 'poco'];

const FEATURES: Record<string, string> = {
    'chụp ảnh': 'camera', 'camera': 'camera', 'chụp hình': 'camera', 'nhiếp ảnh': 'camera', 'selfie': 'camera',
    'pin trâu': 'battery', 'pin khủng': 'battery', 'pin lâu': 'battery', 'sạc nhanh': 'battery', 'trâu': 'battery',
    'game': 'gaming', 'chơi game': 'gaming', 'cấu hình': 'gaming', 'mượt': 'gaming', 'chip': 'gaming', 'snapdragon': 'gaming',
    'gập': 'foldable', 'fold': 'foldable', 'màn hình gập': 'foldable',
    'học sinh': 'student', 'sinh viên': 'student', 'rẻ': 'cheap', 'giá rẻ': 'cheap', 'tiết kiệm': 'cheap',
};

function extractPrice(message: string): { min: number | null; max: number | null } {
    const patterns = [
        { regex: /(\d+)\s*(?:-|đến)\s*(\d+)\s*(?:triệu|tr)/i, offset: (a: number, b: number) => ({ min: a * 1000000, max: b * 1000000 }) },
        { regex: /(?:tầm|khoảng|tầm giá|giá tầm|chừng|giá)\s*(\d+(?:\.\d+)?)\s*(?:triệu|tr)/i, offset: (v: number) => ({ min: (v - 2) * 1000000, max: (v + 2) * 1000000 }) },
        { regex: /(?:dưới|dươi|trong tầm|không quá)\s*(\d+(?:\.\d+)?)\s*(?:triệu|tr)/i, offset: (v: number) => ({ min: null, max: v * 1000000 }) },
        { regex: /(?:trên|hơn|nhiều hơn)\s*(\d+(?:\.\d+)?)\s*(?:triệu|tr)/i, offset: (v: number) => ({ min: v * 1000000, max: null }) },
        { regex: /(\d+(?:\.\d+)?)\s*(?:triệu|tr)\b/i, offset: (v: number) => ({ min: (v - 2) * 1000000, max: (v + 2) * 1000000 }) },
    ];
    for (const p of patterns) {
        const match = message.match(p.regex);
        if (match) {
            const result = p.offset(parseFloat(match[1]), match[2] ? parseFloat(match[2]) : 0);
            if (/rẻ|học sinh|sinh viên/i.test(message)) return { min: null, max: 5000000 };
            return result;
        }
    }
    return { min: null, max: null };
}

// Format danh sách sản phẩm để hiển thị trong reply (không markdown, không slug)
function formatProductList(products: any[]): string {
    if (products.length === 0) return '';
    return products.slice(0, 3).map((p: any) => {
        const name = p.name || '';
        const price = formatPrice(p);
        return `• ${name} - ${price}`;
    }).join('\n');
}

async function processMessage(message: string): Promise<any> {
    const msg = message.toLowerCase().trim();

    // HANDOVER
    if (/gặp nhân viên|tư vấn trực tiếp|gọi điện|hotline|số điện thoại|liên hệ/i.test(msg)) {
        return {
            intent: 'HANDOVER',
            reply: 'Dạ, để hỗ trợ bạn chi tiết hơn, bạn muốn kết nối qua kênh nào ạ?',
            filters: { brand: null, price_min: null, price_max: null, feature: null },
            faq_type: null,
            suggested_buttons: ['💬 Chat Messenger', '💬 Chat Zalo'],
            products: [],
        };
    }

    // GREETING
    if (/^(chào|hello|hi|hey|alo|ê|chao|helo)/i.test(msg)) {
        return {
            intent: 'GREETING',
            reply: 'Chào bạn! Chào mừng bạn đến với **Di Động Việt** ạ! 🌟\n\nEm có thể giúp gì cho bạn hôm nay?\n• 📱 Điện thoại\n• 💻 Laptop\n• ⌚ Smartwatch\n• 🎧 Phụ kiện\n\nHãy cho em biết nhu cầu của bạn nhé!',
            filters: { brand: null, price_min: null, price_max: null, feature: null },
            faq_type: null,
            suggested_buttons: ['Mua điện thoại', 'Mua laptop', 'Phụ kiện', 'Chính sách bảo hành', 'Tin công nghệ'],
            products: [],
        };
    }

    // Tin công nghệ
    if (/tin tức|bài viết|công nghệ|blog|tin công nghệ|đánh giá|review|khuyến mãi/i.test(msg)) {
        const blogs = await getBlogsFromDB();
        if (blogs.length > 0) {
            const blogList = blogs.slice(0, 5).map((b: any) =>
                `📰 **${b.title}** (${b.category || 'Tin tức'})`
            ).join('\n');
            return {
                intent: 'SEARCH_PRODUCT',
                reply: `Dạ, đây là các tin tức công nghệ mới nhất tại Di Động Việt:\n\n${blogList}\n\n👉 Bạn muốn đọc bài nào ạ?`,
                filters: { brand: null, price_min: null, price_max: null, feature: null },
                faq_type: null,
                suggested_buttons: ['Xem thêm tin tức', 'Mua điện thoại', 'Gặp nhân viên'],
                products: [],
            };
        }
    }

    // SEARCH_PRODUCT
    const price = extractPrice(msg);
    const hasPrice = price.min !== null || price.max !== null;
    const hasCheap = /rẻ|học sinh|sinh viên/i.test(msg);

    // Tìm brand
    let brand: string | null = null;
    for (const b of BRANDS) {
        if (msg.includes(b)) {
            brand = b === 'apple' ? 'iPhone' : b.charAt(0).toUpperCase() + b.slice(1);
            break;
        }
    }

    // Tìm feature
    let feature: string | null = null;
    if (hasCheap) feature = 'cheap';
    else {
        for (const [keyword, feat] of Object.entries(FEATURES)) {
            if (msg.includes(keyword)) { feature = feat; break; }
        }
    }

    // Lấy dữ liệu thật từ DB
    const allProducts = await getProductsFromDB();
    let matchedProducts: any[] = [...allProducts];

    // Lọc theo brand
    if (brand) {
        matchedProducts = filterByBrand(matchedProducts, brand);
    }

    // Nếu chỉ có brand, không có price/feature -> hỏi thêm
    if (brand && !hasPrice && !feature) {
        const brandName = brand;
        const brandProducts = filterByBrand(allProducts, brandName);
        const count = brandProducts.length;

        return {
            intent: 'SEARCH_PRODUCT',
            reply: `Dạ, **${brandName}** hiện có **${count} sản phẩm** tại cửa hàng ạ! Bạn đang tìm dòng máy thiên về tính năng nào ạ?`,
            filters: { brand: brandName, price_min: null, price_max: null, feature: null },
            faq_type: null,
            suggested_buttons: ['Chụp ảnh đẹp', 'Pin trâu / Cấu hình mạnh', 'Giá rẻ học sinh', 'Xem tất cả'],
            products: brandProducts.slice(0, 3).map((p: any) => p.slug || p._id),
        };
    }

    // Lọc theo giá
    if (hasPrice) {
        matchedProducts = filterByPrice(matchedProducts, price.min, price.max);
    }

    // Lọc theo feature
    if (feature) {
        const featureProducts = filterByFeature(matchedProducts, feature);
        if (featureProducts.length > 0) {
            matchedProducts = featureProducts;
        }
    }

    // Nếu không có sản phẩm phù hợp
    if (matchedProducts.length === 0) {
        return {
            intent: 'SEARCH_PRODUCT',
            reply: 'Dạ, hiện tại cửa hàng chưa có sản phẩm phù hợp với nhu cầu của bạn. Bạn vui lòng để lại thông tin, nhân viên sẽ tư vấn trực tiếp cho bạn ạ!',
            filters: { brand, price_min: price.min, price_max: price.max, feature },
            faq_type: null,
            suggested_buttons: ['Gặp nhân viên', 'Xem tất cả sản phẩm'],
            products: [],
        };
    }

    // Có sản phẩm phù hợp
    const topProducts = matchedProducts.slice(0, 3);
    const productList = formatProductList(topProducts);
    const productSlugs = topProducts.map((p: any) => p.slug || p._id);

    let reply = '';
    if (feature === 'camera') {
        reply = `Dạ, các sản phẩm chụp ảnh đẹp tại cửa hàng:\n\n${productList}\n\nBạn muốn xem chi tiết sản phẩm nào ạ?`;
    } else if (feature === 'gaming') {
        reply = `Dạ, các sản phẩm cấu hình mạnh chơi game tốt:\n\n${productList}\n\nBạn muốn xem sản phẩm nào trước ạ?`;
    } else if (feature === 'battery') {
        reply = `Dạ, các sản phẩm pin trâu tại cửa hàng:\n\n${productList}\n\nBạn muốn xem sản phẩm nào ạ?`;
    } else if (feature === 'cheap' || feature === 'student') {
        reply = `Dạ, các sản phẩm giá tốt dành cho bạn:\n\n${productList}\n\nBạn muốn xem sản phẩm nào trước ạ?`;
    } else if (brand) {
        reply = `Dạ, **${brand}** có các sản phẩm sau phù hợp với nhu cầu của bạn:\n\n${productList}\n\nBạn muốn tìm hiểu thêm về sản phẩm nào ạ?`;
    } else {
        reply = `Dạ, các sản phẩm phù hợp với nhu cầu của bạn:\n\n${productList}\n\nBạn muốn xem sản phẩm nào trước ạ?`;
    }

    return {
        intent: 'SEARCH_PRODUCT',
        reply,
        filters: { brand, price_min: price.min, price_max: price.max, feature },
        faq_type: null,
        suggested_buttons: ['Xem chi tiết', 'So sánh', 'Gặp nhân viên'],
        products: productSlugs,
    };
}

// ==================== API Handler ====================

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        if (!message || typeof message !== 'string') {
            return Response.json({ success: false, error: 'Tin nhắn không hợp lệ' }, { status: 400 });
        }

        // Kiểm tra FAQ trước
        const faqCheck = checkFAQ(message);
        if (faqCheck) return Response.json({ success: true, data: faqCheck });

        // Xử lý
        const result = await processMessage(message);
        return Response.json({ success: true, data: result });

    } catch (error: any) {
        console.error('Chatbot API error:', error?.message || error);
        return Response.json({
            success: false,
            error: error?.message || 'Lỗi xử lý tin nhắn',
            data: {
                intent: 'UNKNOWN',
                reply: 'Dạ, hiện tại hệ thống đang bận. Bạn vui lòng thử lại sau ạ! 🙏',
                filters: { brand: null, price_min: null, price_max: null, feature: null },
                faq_type: null,
                suggested_buttons: ['Thử lại', 'Gặp nhân viên'],
                products: [],
            },
        }, { status: 200 });
    }
}