import { CONTACT_INFO, MENU_CATEGORIES, CUSTOMER_SERVICES } from "@/constants";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Di Động Việt</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {CONTACT_INFO.company}
                        </p>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" />
                                <span>{CONTACT_INFO.address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhoneAlt className="text-primary" />
                                <span className="font-semibold">{CONTACT_INFO.hotline}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-primary" />
                                <Link href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary">
                                    {CONTACT_INFO.email}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Danh mục sản phẩm</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {MENU_CATEGORIES.slice(0, 5).map((cat) => (
                                <li key={cat.title}>
                                    <Link href="#" className="hover:text-primary transition-colors block">{cat.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {CUSTOMER_SERVICES.map((service) => (
                                <li key={service.label}>
                                    <Link href={service.link} className="hover:text-primary transition-colors block">{service.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Kết nối với chúng tôi</h3>
                        <div className="flex items-center gap-3 mb-4 text-gray-600">
                            <Link href={CONTACT_INFO.social.facebook} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary transition-colors">
                                    <FaFacebookF size={16} />
                                </div>
                            </Link>
                            <Link href={CONTACT_INFO.social.youtube} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary transition-colors">
                                    <FaYoutube size={16} />
                                </div>
                            </Link>
                            <Link href={CONTACT_INFO.social.tiktok} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary transition-colors">
                                    <FaTiktok size={16} />
                                </div>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Mua sắm dễ dàng, giao hàng nhanh chóng và hỗ trợ tận tâm. Nâng cao trải nghiệm với chính sách bảo hành rõ ràng.
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Bản quyền thuộc về Di Động Việt. MST: {CONTACT_INFO.business_license}.
                    </p>
                </div>
            </div>
        </footer>
    );
}
