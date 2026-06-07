import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { FaImage, FaVideo, FaYoutube } from 'react-icons/fa';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  createBlogPending: boolean;
}

export function CreateBlogModal({
  isOpen,
  onClose,
  onSubmit,
  createBlogPending,
}: CreateBlogModalProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [promptConfig, setPromptConfig] = React.useState<{
    title: string;
    placeholder: string;
    onSubmit: (value: string) => void;
  } | null>(null);
  const [promptInputValue, setPromptInputValue] = React.useState('');

  const getYouTubeEmbedUrl = (urlOrId: string): string => {
    if (!urlOrId) return '';
    if (urlOrId.includes('youtube.com/embed/')) {
      return urlOrId;
    }
    let videoId = '';
    try {
      if (urlOrId.includes('youtube.com') || urlOrId.includes('youtu.be')) {
        const url = new URL(urlOrId);
        if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.slice(1);
        } else {
          videoId = url.searchParams.get('v') || '';
          if (!videoId && url.pathname.startsWith('/embed/')) {
            videoId = url.pathname.split('/')[2];
          }
        }
      } else {
        videoId = urlOrId.trim();
      }
    } catch (e) {
      videoId = urlOrId.trim();
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const insertAtCursor = (textBefore: string, textAfter: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const selectedText = value.substring(start, end);
    const replacement = textBefore + selectedText + textAfter;

    textarea.value = value.substring(0, start) + replacement + value.substring(end);
    textarea.focus();

    // Set selection
    const newCursorPos = start + replacement.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  };

  const handleInsertImage = () => {
    setPromptInputValue('');
    setPromptConfig({
      title: 'Chèn hình ảnh vào bài viết',
      placeholder: 'Nhập đường dẫn (URL) hình ảnh (ví dụ: https://example.com/image.jpg)...',
      onSubmit: (url) => {
        const imgHtml = `\n<img src="${url}" alt="Hình ảnh bài viết" class="rounded-xl my-4 mx-auto max-w-full" />\n`;
        insertAtCursor(imgHtml);
      }
    });
  };

  const handleInsertVideo = () => {
    setPromptInputValue('');
    setPromptConfig({
      title: 'Chèn video MP4 vào bài viết',
      placeholder: 'Nhập đường dẫn (URL) video (ví dụ: https://example.com/video.mp4)...',
      onSubmit: (url) => {
        const videoHtml = `\n<video src="${url}" controls class="w-full rounded-xl my-4"></video>\n`;
        insertAtCursor(videoHtml);
      }
    });
  };

  const handleInsertYoutube = () => {
    setPromptInputValue('');
    setPromptConfig({
      title: 'Chèn video YouTube vào bài viết',
      placeholder: 'Nhập đường dẫn (URL) hoặc ID video YouTube...',
      onSubmit: (input) => {
        const embedUrl = getYouTubeEmbedUrl(input);
        if (!embedUrl) {
          alert('Đường dẫn YouTube không hợp lệ!');
          return;
        }
        const youtubeHtml = `\n<iframe src="${embedUrl}" class="w-full aspect-video rounded-xl my-4" allowfullscreen></iframe>\n`;
        insertAtCursor(youtubeHtml);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Viết bài tin tức công nghệ mới
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='p-6 space-y-4 overflow-y-auto flex-1 text-sm'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Tiêu đề bài viết
              </label>
              <Input
                name='title'
                placeholder='Ví dụ: Đánh giá iPhone 16 Pro Max...'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Chuyên mục tin
              </label>
              <select
                name='category'
                required
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200'
              >
                <option value='Công nghệ'>Công nghệ</option>
                <option value='Đánh giá'>Đánh giá</option>
                <option value='Khuyến mãi'>Khuyến mãi</option>
                <option value='Tư vấn'>Tư vấn</option>
                <option value='Tin mới'>Tin mới</option>
              </select>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Mô tả ngắn (Summary - Tối đa 300 ký tự)
            </label>
            <Input
              name='summary'
              maxLength={300}
              placeholder='Mô tả tóm tắt nội dung bài viết hiển thị ở trang tin...'
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Ảnh đại diện bài viết (Featured Image URL)
            </label>
            <Input
              name='featuredImage'
              placeholder='Ví dụ: /uploads/blogs/iphone16.jpg hoặc url ngoài...'
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Nội dung bài viết (Định dạng HTML hoặc Text)
              </label>
              <div className='flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800'>
                <button
                  type='button'
                  onClick={handleInsertImage}
                  className='p-1 px-2 text-[11px] font-semibold text-slate-600 dark:text-slate-350 hover:text-didongviet-red dark:hover:text-didongviet-red hover:bg-white dark:hover:bg-slate-900 rounded-md transition-all flex items-center gap-1 cursor-pointer border-none bg-transparent'
                  title='Chèn hình ảnh'
                >
                  <FaImage size={12} className='text-emerald-500' />
                  <span>Ảnh</span>
                </button>
                <div className='h-3 w-px bg-slate-200 dark:bg-slate-800' />
                <button
                  type='button'
                  onClick={handleInsertVideo}
                  className='p-1 px-2 text-[11px] font-semibold text-slate-600 dark:text-slate-350 hover:text-didongviet-red dark:hover:text-didongviet-red hover:bg-white dark:hover:bg-slate-900 rounded-md transition-all flex items-center gap-1 cursor-pointer border-none bg-transparent'
                  title='Chèn video MP4'
                >
                  <FaVideo size={12} className='text-blue-500' />
                  <span>Video</span>
                </button>
                <div className='h-3 w-px bg-slate-200 dark:bg-slate-800' />
                <button
                  type='button'
                  onClick={handleInsertYoutube}
                  className='p-1 px-2 text-[11px] font-semibold text-slate-600 dark:text-slate-350 hover:text-didongviet-red dark:hover:text-didongviet-red hover:bg-white dark:hover:bg-slate-900 rounded-md transition-all flex items-center gap-1 cursor-pointer border-none bg-transparent'
                  title='Chèn video từ YouTube'
                >
                  <FaYoutube size={12} className='text-red-500' />
                  <span>YouTube</span>
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              name='content'
              placeholder='Nhập nội dung đầy đủ của bài viết...'
              required
              rows={8}
              className='w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:border-didongviet-red outline-none'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Tags (Ngăn cách bằng dấu phẩy)
              </label>
              <Input
                name='tags'
                placeholder='iphone16, apple, review'
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Trạng thái xuất bản
              </label>
              <select
                name='status'
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200'
              >
                <option value='Lưu nháp'>Lưu nháp (Draft)</option>
                <option value='Đã xuất bản'>Đã xuất bản (Publish)</option>
              </select>
            </div>
          </div>

          <div className='bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3'>
            <span className='text-xs font-bold text-slate-600 dark:text-slate-400 block'>
              Cấu hình SEO Meta nâng cao (Tùy chọn)
            </span>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <span className='text-[10px] font-semibold text-slate-400 block uppercase'>
                  Meta Title
                </span>
                <Input
                  name='metaTitle'
                  placeholder='Đánh giá chi tiết iPhone 16...'
                  className='py-3 h-9 rounded-lg border-slate-200 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <span className='text-[10px] font-semibold text-slate-400 block uppercase'>
                  Meta Description
                </span>
                <Input
                  name='metaDescription'
                  placeholder='iPhone 16 Pro Max có thực sự đáng tiền...'
                  className='py-3 h-9 rounded-lg border-slate-200 text-xs'
                />
              </div>
            </div>
          </div>

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={createBlogPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {createBlogPending ? 'Đang tạo...' : 'Lưu bài viết'}
            </Button>
          </div>
        </form>
      </div>

      {promptConfig && (
        <div className='fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 relative text-left'>
            <div className='space-y-1.5'>
              <h4 className='text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight'>
                {promptConfig.title}
              </h4>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                Hãy dán liên kết (URL) vào ô bên dưới:
              </p>
            </div>
            <input
              type='text'
              autoFocus
              value={promptInputValue}
              onChange={(e) => setPromptInputValue(e.target.value)}
              placeholder={promptConfig.placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (promptInputValue.trim()) {
                    promptConfig.onSubmit(promptInputValue.trim());
                    setPromptConfig(null);
                  }
                }
              }}
              className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-medium focus:border-didongviet-red outline-none shadow-2xs transition-colors'
            />
            <div className='flex items-center gap-3 pt-2 justify-end'>
              <button
                type='button'
                onClick={() => setPromptConfig(null)}
                className='h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                Hủy bỏ
              </button>
              <button
                type='button'
                onClick={() => {
                  if (promptInputValue.trim()) {
                    promptConfig.onSubmit(promptInputValue.trim());
                    setPromptConfig(null);
                  }
                }}
                className='h-8 px-4 rounded-lg bg-didongviet-red hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none'
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
