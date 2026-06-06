'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProductFAQProps {
    product: any;
}

export default function ProductFAQ({ product }: ProductFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // FAQ data mặc định cho các sản phẩm
    const defaultFAQs = [
        {
            q: `${product?.name} có bảo hành chính hãng không?`,
            a: `Có! Sản phẩm ${product?.name} bán tại Di Động Việt đều là hàng chính hãng 100% với bảo hành chính thức từ nhà sản xuất trong ${product?.warrantyPeriod || '12 tháng'}. Bạn có thể mang máy bảo hành tại bất kỳ trung tâm bảo hành ủy quyền nào.`,
        },
        {
            q: 'Tôi có thể trả góp khi mua sản phẩm này không?',
            a: 'Có! Di Động Việt hỗ trợ trả góp 0% lãi suất thông qua hơn 20 ngân hàng đối tác bằng thẻ tín dụng hoặc thông qua các công ty tài chính (Home Credit, FE Credit, HD Saison). Thủ tục duyệt hồ sơ cực nhanh chỉ trong 15-30 phút.',
        },
        {
            q: 'Chương trình Thu cũ đổi mới (Trade-in) có áp dụng cho sản phẩm này không?',
            a: `Có! Bạn chỉ cần mang chiếc máy cũ của mình đến cửa hàng Di Động Việt gần nhất. Nhân viên kỹ thuật sẽ định giá máy cũ dựa trên tình trạng thực tế. Mức định giá này cộng thêm khoản trợ giá độc quyền từ Di Động Việt sẽ được trừ trực tiếp vào giá bán của máy mới.`,
        },
        {
            q: 'Sản phẩm này có cam kết chính hãng 100% không?',
            a: `Tuyệt đối! Tất cả sản phẩm bán ra tại Di Động Việt đều là hàng chính hãng 100%, có hóa đơn đầy đủ và được bảo hành theo đúng quy định của nhà sản xuất. Nếu phát hiện hàng giả, Di Động Việt cam kết hoàn tiền 100% hoặc đổi sản phẩm mới.`,
        },
        {
            q: 'Di Động Việt có hỗ trợ giao hàng tận nơi không?',
            a: 'Di Động Việt hỗ trợ giao hàng nhanh toàn quốc, miễn phí giao hàng cho thành viên D.Member hoặc đơn hàng đạt giá trị tối thiểu theo quy định. Vui lòng liên hệ hotline 1800.6018 để được hỗ trợ cụ thể.',
        },
        {
            q: 'Làm sao để tham gia chương trình D.Member của Di Động Việt?',
            a: 'Chương trình D.Member hoàn toàn miễn phí. Bạn chỉ cần có tài khoản tại Di Động Việt và mua lần đầu tiên là sẽ được tự động kích hoạt. Thành viên D.Member sẽ được giảm thêm 1% trên mọi đơn hàng và nhiều ưu đãi khác.',
        },
    ];

    return (
        <div className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs space-y-3'>
            <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
                <div className='h-1 w-3.5 bg-purple-500 rounded-full' />
                <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                    Câu hỏi thường gặp
                </h3>
            </div>

            <div className='space-y-2'>
                {defaultFAQs.map((faq, idx) => (
                    <div
                        key={idx}
                        className='border border-slate-100 rounded-lg overflow-hidden hover:border-slate-200 transition-colors'
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className='w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left group'
                        >
                            <ChevronDown
                                size={16}
                                className={`mt-0.5 text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''
                                    }`}
                            />
                            <span className='text-xs font-bold text-slate-800 group-hover:text-didongviet-red transition-colors'>
                                {faq.q}
                            </span>
                        </button>

                        {openIndex === idx && (
                            <div className='px-4 py-3 bg-slate-50/50 border-t border-slate-100'>
                                <p className='text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line'>
                                    {faq.a}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='pt-2 text-center'>
                <p className='text-[10px] text-slate-500'>
                    Bạn có câu hỏi khác?{' '}
                    <a href='/contact' className='text-didongviet-red font-bold hover:underline'>
                        Liên hệ hỗ trợ
                    </a>
                </p>
            </div>
        </div>
    );
}
