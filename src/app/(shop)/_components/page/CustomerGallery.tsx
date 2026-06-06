'use client';

export default function CustomerGallery() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=400&q=80',
      caption: 'Nghệ sĩ tin dùng sản phẩm chính hãng',
    },
    {
      url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=400&q=80',
      caption: 'Khách hàng lên đời iPhone mới',
    },
    {
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=400&q=80',
      caption: 'Trải nghiệm mua sắm chuyên nghiệp',
    },
    {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80',
      caption: 'Hỗ trợ kỹ thuật tận tâm chu đáo',
    },
    {
      url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80',
      caption: 'Khách hàng D.Member nhận ưu đãi',
    },
  ];

  return (
    <section className='space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs'>
      <div className='text-center space-y-0.5'>
        <h2 className='text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center justify-center gap-1.5'>
          <span>DI ĐỘNG VIỆT CÙNG KHÁCH HÀNG</span>
        </h2>
        <p className='text-[10px] text-gray-400 font-medium'>
          Hàng ngàn nghệ sĩ, KOLs và hàng triệu khách hàng tin tưởng mua sắm
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5'>
        {images.map((img, idx) => (
          <div
            key={idx}
            className='rounded-xl overflow-hidden relative aspect-4/3 group border border-slate-100 dark:border-slate-800 shadow-xs'
          >
            <img
              src={img.url}
              alt={img.caption}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90' />
            <span className='absolute bottom-2.5 left-2.5 right-2.5 text-[9px] font-bold text-white text-center drop-shadow-md leading-tight line-clamp-1'>
              {img.caption}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
