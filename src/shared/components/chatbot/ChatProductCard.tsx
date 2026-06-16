'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        imageUrl: string;
        price: number;
        slug: string;
    };
}

function formatVND(num: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(num);
}

export default function ChatProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/category/${product.slug}`}
            className='flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow'
        >
            {/* Ảnh sản phẩm */}
            <div className='relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50'>
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className='object-contain p-1'
                        sizes='64px'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                        No img
                    </div>
                )}
            </div>

            {/* Thông tin */}
            <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-gray-800 line-clamp-2 leading-tight'>
                    {product.name}
                </p>
                <p className='text-sm font-bold text-red-600 mt-1'>
                    {formatVND(product.price)}
                </p>
            </div>

            {/* Nút xem */}
            <div className='flex-shrink-0 bg-red-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-red-600 transition-colors'>
                Xem
            </div>
        </Link>
    );
}