'use client';

import { useState } from 'react';
import { ShieldCheck, RotateCw, Truck, BadgeCheck, Play } from 'lucide-react';

interface ProductGalleryProps {
  product: any;
  activeImage: string;
  setActiveImage: (url: string) => void;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  percentOff: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function getImageUrl(url: string | undefined | null): string {
  if (!url) return '/placeholder-product.png';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

/** Chuyển YouTube watch URL → embed URL. Trả về null nếu không phải YouTube. */
function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // https://www.youtube.com/watch?v=XXXX
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1`;
    }
    // https://youtu.be/XXXX
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}?autoplay=1`;
    }
  } catch { }
  return null;
}

/** Lấy thumbnail YouTube nếu có */
function getYoutubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://img.youtube.com/vi/${u.searchParams.get('v')}/hqdefault.jpg`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://img.youtube.com/vi${u.pathname}/hqdefault.jpg`;
    }
  } catch { }
  return null;
}

function getVideoUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

export default function ProductGallery({
  product,
  activeImage,
  setActiveImage,
  isLiked,
  setIsLiked,
  percentOff,
}: ProductGalleryProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const rawVideoUrl = product.video || null;
  const videoUrl = getVideoUrl(rawVideoUrl);
  const youtubeEmbed = videoUrl ? getYoutubeEmbedUrl(videoUrl) : null;
  const youtubeThumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null;
  // Video là YouTube nếu có embed URL; ngược lại là file local
  const isYoutube = !!youtubeEmbed;

  const allImages = [...(product.images || [])];

  type MediaItem =
    | { type: 'video'; url: string; alt: string; thumb: string | null }
    | { type: 'image'; url: string; alt: string };

  const allMedia: MediaItem[] = [
    ...(videoUrl
      ? [
        {
          type: 'video' as const,
          url: videoUrl,
          alt: 'Video sản phẩm',
          thumb: youtubeThumbnail,
        },
      ]
      : []),
    ...allImages.map((img: any) => ({
      type: 'image' as const,
      url: getImageUrl(img.url),
      alt: img.alt || product.name,
    })),
  ];

  const handleSelectMedia = (item: MediaItem) => {
    if (item.type === 'video') {
      setIsVideoPlaying(true);
    } else {
      setIsVideoPlaying(false);
      setActiveImage(item.url);
    }
  };

  return (
    <div className='lg:col-span-6 space-y-3 relative z-10'>
      {/* Khung media chính */}
      <div className='aspect-square w-full rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center relative group overflow-hidden'>
        {percentOff > 0 && !isVideoPlaying && (
          <span className='absolute top-3 left-3 z-10 px-2 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase animate-pulse'>
            -{percentOff}%
          </span>
        )}

        {isVideoPlaying && videoUrl ? (
          isYoutube ? (
            /* YouTube: nhúng iframe */
            <iframe
              src={youtubeEmbed!}
              title='Video sản phẩm'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='absolute inset-0 w-full h-full rounded-xl border-0'
            />
          ) : (
            /* Video file local */
            <video
              src={videoUrl}
              controls
              autoPlay
              className='absolute inset-0 w-full h-full object-contain rounded-xl'
              onEnded={() => setIsVideoPlaying(false)}
            />
          )
        ) : (
          /* Ảnh chính */
          <img
            src={getImageUrl(activeImage)}
            alt={product.name}
            className='h-full w-full object-contain px-12 py-8 transition-transform duration-500 group-hover:scale-105'
            referrerPolicy='no-referrer'
          />
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className='flex gap-2 overflow-x-auto py-0.5 scrollbar-thin'>
          {allMedia.map((item, idx) => {
            const isActive =
              item.type === 'video'
                ? isVideoPlaying
                : !isVideoPlaying && activeImage === item.url;

            return (
              <button
                key={idx}
                onClick={() => handleSelectMedia(item)}
                className={`h-14 w-14 rounded-lg border-2 flex items-center justify-center p-0.5 bg-white flex-shrink-0 cursor-pointer transition-all hover:border-didongviet-red/50 relative overflow-hidden
                  ${isActive ? 'border-didongviet-red shadow-sm' : 'border-slate-100'}`}
              >
                {item.type === 'video' ? (
                  item.thumb ? (
                    /* Thumbnail YouTube thực */
                    <div className='relative h-full w-full'>
                      <img
                        src={item.thumb}
                        alt='Video'
                        className='h-full w-full object-cover rounded'
                      />
                      <div className='absolute inset-0 flex items-center justify-center bg-black/30 rounded'>
                        <Play size={14} className='text-white fill-white' />
                      </div>
                    </div>
                  ) : (
                    /* Thumbnail video local: nền tối + Play */
                    <div className='h-full w-full rounded flex items-center justify-center bg-slate-800'>
                      <Play size={18} className='text-white fill-white' />
                    </div>
                  )
                ) : (
                  <img
                    src={
                      (item as { type: 'image'; url: string; alt: string }).url
                    }
                    alt={item.alt}
                    className='h-full w-full object-contain'
                    referrerPolicy='no-referrer'
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Cam kết dịch vụ */}
      <div className='bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5 text-[10px]'>
        <span className='font-black text-slate-800 uppercase block tracking-wider text-[9px]'>
          Cam kết Di Động Việt
        </span>
        <div className='grid grid-cols-2 gap-2 text-gray-500 font-medium'>
          {[
            {
              icon: ShieldCheck,
              color: 'text-emerald-600',
              label: 'Bảo hành 12-24T',
            },
            {
              icon: RotateCw,
              color: 'text-blue-500',
              label: '1 đổi 1 trong 30 ngày',
            },
            { icon: Truck, color: 'text-purple-600', label: 'Giao hỏa tốc 2h' },
            {
              icon: BadgeCheck,
              color: 'text-amber-500',
              label: 'Trả góp 0% lãi',
            },
          ].map((item, idx) => (
            <div key={idx} className='flex items-center gap-1.5'>
              <item.icon size={13} className={`${item.color} flex-shrink-0`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
