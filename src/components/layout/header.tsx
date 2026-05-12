import Link from "next/link";
import { Search, ShoppingCart, MapPin, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo Di Động Việt */}
                <Link href="/" className="flex-shrink-0">
                    <div className="text-primary font-black text-2xl tracking-tighter flex flex-col leading-none">
                        <span>DI ĐỘNG</span>
                        <span className="text-sm font-bold text-gray-700">VIỆT</span>
                    </div>
                </Link>

                {/* Thanh tìm kiếm */}
                <div className="hidden md:flex flex-1 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Bạn cần tìm gì? (iPhone 16, Samsung...)"
                        className="w-full bg-gray-100 border-none rounded-full py-2 px-5 pr-10 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Các tiện ích */}
                <div className="flex items-center gap-2 md:gap-6 text-xs font-medium">
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-gray-500 font-normal">Gọi mua hàng</p>
                            <p className="text-sm font-bold">{CONTACT_INFO.hotline}</p>
                        </div>
                    </div>

                    <Link href="/he-thong-cua-hang" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                        <MapPin size={20} />
                        <span className="hidden sm:inline">Cửa hàng</span>
                    </Link>

                    <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-primary transition-colors relative">
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">Giỏ hàng</span>
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            0
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}