'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Trash2, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import type { ChatbotMessage } from './useChatbot';

interface ChatbotWindowProps {
    messages: ChatbotMessage[];
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onSendMessage: (text: string) => void;
    onButtonClick: (text: string) => void;
    onClose: () => void;
    onClear: () => void;
}

// Kích thước mặc định
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 520;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

export default function ChatbotWindow({
    messages,
    isLoading,
    messagesEndRef,
    onSendMessage,
    onButtonClick,
    onClose,
    onClear,
}: ChatbotWindowProps) {
    const [input, setInput] = useState('');

    // State cho resize
    const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
    // State cho vị trí (drag)
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState('');

    const dragStart = useRef({ x: 0, y: 0 });
    const posStart = useRef({ x: 0, y: 0 });
    const sizeStart = useRef({ w: 0, h: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    // Xử lý drag
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.no-drag')) return;
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        posStart.current = { x: position.x, y: position.y };
    }, [position]);

    // Xử lý resize
    const handleResizeStart = useCallback((e: React.MouseEvent, dir: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(dir);
        dragStart.current = { x: e.clientX, y: e.clientY };
        sizeStart.current = { w: size.width, h: size.height };
    }, [size]);

    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                setPosition({
                    x: posStart.current.x + dx,
                    y: posStart.current.y + dy,
                });
            }

            if (isResizing) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                let newW = sizeStart.current.w;
                let newH = sizeStart.current.h;

                if (resizeDir.includes('w')) newW -= dx;
                if (resizeDir.includes('e')) newW += dx;
                if (resizeDir.includes('s')) newH += dy;
                if (resizeDir.includes('n')) newH -= dy;

                newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newW));
                newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newH));

                setSize({ width: newW, height: newH });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDir]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            ref={windowRef}
            className='absolute bottom-16 right-0 bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300'
            style={{
                width: size.width,
                height: size.height,
                transform: position.x !== 0 || position.y !== 0
                    ? `translate(${position.x}px, ${position.y}px)`
                    : undefined,
            }}
        >
            {/* Resize handles */}
            <div
                className='absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
                className='absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
                className='absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
                className='absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            <div
                className='absolute top-0 left-3 right-3 h-1 cursor-n-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
                className='absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
                className='absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
                className='absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-10'
                onMouseDown={(e) => handleResizeStart(e, 'e')}
            />

            {/* Header - có thể kéo */}
            <div
                className='bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 cursor-grab active:cursor-grabbing no-drag'
                onMouseDown={handleMouseDown}
            >
                <div className='flex items-center gap-2.5'>
                    <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold'>
                        DV
                    </div>
                    <div>
                        <p className='text-sm font-semibold'>Di Động Việt</p>
                        <p className='text-[10px] text-red-100'>
                            {isLoading ? 'Đang trả lời...' : 'Trực tuyến'}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <button
                        onClick={onClear}
                        title='Xóa lịch sử'
                        className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors'
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={onClose}
                        title='Đóng'
                        className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors'
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-3 py-3 space-y-1 scroll-smooth'>
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        onButtonClick={onButtonClick}
                    />
                ))}

                {/* Loading */}
                {isLoading && (
                    <div className='flex justify-start mb-3'>
                        <div className='max-w-[280px]'>
                            <div className='flex items-center gap-1.5 mb-1'>
                                <div className='w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0'>
                                    DV
                                </div>
                                <span className='text-[10px] text-gray-400'>
                                    Di Động Việt
                                </span>
                            </div>
                            <div className='bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'>
                                <div className='flex items-center gap-2'>
                                    <Loader2
                                        size={16}
                                        className='animate-spin text-red-500'
                                    />
                                    <span className='text-sm text-gray-500'>
                                        Đang suy nghĩ...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className='flex-shrink-0 border-t border-gray-200 bg-white px-3 py-2.5 flex items-center gap-2'
            >
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Nhập tin nhắn...'
                    disabled={isLoading}
                    className='flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-400 disabled:opacity-50'
                />
                <button
                    type='submit'
                    disabled={!input.trim() || isLoading}
                    className='w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                >
                    <Send size={15} />
                </button>
            </form>
        </div>
    );
}