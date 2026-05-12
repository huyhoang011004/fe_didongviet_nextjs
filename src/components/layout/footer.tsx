import { CONTACT_INFO, MENU_CATEGORIES } from "@/constants";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 pt-10 pb-6 border-t border-gray-200 mt-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Cột 1: Thông tin công ty */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Về Di Động Việt</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {CONTACT_INFO.company}
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Địa chỉ: {CONTACT_INFO.address}</li>
                            <li>Hotline: <span className="font-bold text-primary">{CONTACT_INFO.hotline}</span></li>
                            <li>Email: {CONTACT_INFO.email}</li>
                        </ul>
                    </div>

                    {/* Cột 2 & 3: Danh mục nhanh (Lấy từ constants) */}
                    {MENU_CATEGORIES.slice(0, 2).map((cat, idx) => (
                        <div key={idx}>
                            <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">{cat.title}</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {cat.items.map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="hover:text-primary transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Cột 4: Chính sách & Kết nối */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2 text-sm text-gray-600 mb-6">
                            <li><Link href="#" className="hover:text-primary">Chính sách bảo hành</Link></li>
                            <li><Link href="#" className="hover:text-primary">Chính sách đổi trả</Link></li>
                            <li><Link href="#" className="hover:text-primary">Giao hàng & Thanh toán</Link></li>
                        </ul>
                        <div className="flex gap-4">
                            {/* Icon MXH có thể thêm ở đây */}
                            <p className="text-xs text-gray-400 italic font-light">Chuyển giao giá trị vượt trội trong mạng xã hội</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 text-center">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Bản quyền thuộc về Di Động Việt. MSDN: {CONTACT_INFO.business_license}.
                    </p>
                </div>
            </div>
        </footer>
    );
}