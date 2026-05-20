"use client"

import { useState, KeyboardEvent } from "react";
import Link from "next/link";
import { ShoppingCart, Phone, User, MapPinPlus, FileSearchCorner, ShieldCheck, BadgeDollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { BiCategory } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { Label } from "@/components/ui/label";

export default function Header() {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchSubmit = (keyword: string) => {
        if (!keyword.trim()) return
        console.log("Đang tìm kiếm cụm từ:", keyword)
        // Thực hiện router.push(`/search?q=${keyword}`) hoặc gọi API tìm kiếm của Di Động Việt ở đây
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault() // Ngăn reload trang ngoài ý muốn
            handleSearchSubmit(searchValue)
        }
    }
    return (
        <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-sm">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3">
                <div className="flex flex-col gap-2 md:gap-3">
                    <div className="flex items-center justify-between gap-4 md:gap-8 w-full min-w-0">
                        <Link href="/" className="flex flex-row sm:flex-row sm:items-center gap-1 md:gap-2 text-white min-w-0 ">
                            <div className="text-md md:text-3xl font-black tracking-tighter whitespace-nowrap">Di Động</div>
                            <div className="text-xs md:text-base font-semibold uppercase tracking-[0.18em] text-white/90">VIỆT</div>
                        </Link>
                        <div className="overflow-hidden min-w-0 flex-1">
                            <div className="inline-flex min-w-full items-center gap-8 animate-marquee whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={14} className="text-white " />
                                    <span className="text-xs md:text-sm">Thu cũ đổi mới - Lên đời siêu tốc</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeDollarSign size={14} className="text-white " />
                                    <span className="text-xs md:text-sm">Trả góp 0% - Giao hàng miễn phí</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-white " />
                                    <span className="text-xs md:text-sm">BH 12 tháng - 1 đổi 1 trong 30 ngày</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={14} className="text-white " />
                                    <span className="text-xs md:text-sm">Thu cũ đổi mới - Lên đời siêu tốc</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Label asChild className="flex items-center gap-1 text-xs md:text-sm cursor-pointer">
                                <Link href="/track" className="flex items-center gap-1">
                                    <FileSearchCorner size={16} />
                                    <span className="hidden whitespace-nowrap md:inline">Tra cứu đơn hàng</span>
                                </Link>
                            </Label>
                            <Label asChild className="flex items-center gap-1 text-xs md:text-sm cursor-pointer">
                                <Link href="/contact" className="flex items-center gap-1">
                                    <Phone size={16} />
                                    <span className="hidden whitespace-nowrap md:inline">Liên hệ</span>
                                </Link>
                            </Label>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="header" size="header-responsive" >
                                <Link href="/categories" className="flex items-center justify-center gap-1 md:gap-2">
                                    <BiCategory size={16} />
                                    <span className="hidden md:inline text-xs md:text-sm">Danh mục</span>
                                </Link>
                            </Button>
                            <Button asChild variant="header" size="header-responsive" >
                                <Link href="/he-thong-cua-hang" className="flex items-center justify-center gap-1 md:gap-2">
                                    <MapPinPlus size={16} />
                                    <span className="hidden md:inline text-xs md:text-sm">Cửa hàng</span>
                                </Link>
                            </Button>
                        </div>

                        <div className="flex-1 min-w-0 md:justify-center">
                            <div className="w-full md:max-w-2xl md:mx-auto">
                                <div className="relative">
                                    <Command className="rounded-full bg-white text-slate-900 shadow-sm">
                                        <CommandInput
                                            value={searchValue}
                                            onValueChange={(v) => setSearchValue(v)}
                                            onKeyDown={handleKeyDown} 
                                            placeholder="Bạn muốn mua gì?"
                                            className="w-full border-none bg-transparent text-xs md:text-sm text-slate-900 placeholder:text-slate-400 pr-10 md:pr-12"
                                        />
                                    </Command>
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchValue("")}  
                                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 p-1 text-slate-600 transition hover:bg-slate-300 hover:text-slate-900 z-10"
                                            aria-label="Xóa nội dung tìm kiếm"
                                        >
                                            <MdClose size={14}/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button asChild variant="header" size="header-responsive" >
                                <Link href="/cart" className="flex items-center justify-center gap-1 md:gap-2">
                                    <ShoppingCart size={16} />
                                    <span className="hidden md:inline text-xs md:text-sm">Giỏ hàng</span>
                                </Link>
                            </Button>
                            <Button asChild variant="header" size="header-responsive" >
                                <Link href="/login" className="flex items-center justify-center gap-1 md:gap-2">
                                    <User size={16} />
                                    <span className="hidden md:inline text-xs md:text-sm">Đăng nhập</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}


