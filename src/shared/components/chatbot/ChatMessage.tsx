'use client';

import type { ChatbotMessage } from './useChatbot';
import ChatProductCard from './ChatProductCard';
import QuickButtons from './QuickButtons';

interface ChatMessageProps {
    message: ChatbotMessage;
    onButtonClick: (text: string) => void;
}

export default function ChatMessage({ message, onButtonClick }: ChatMessageProps) {
    const isBot = message.role === 'bot';

    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
            <div className={`max-w-[85%] ${isBot ? 'order-1' : 'order-1'}`}>
                {/* Avatar bot */}
                {isBot && (
                    <div className='flex items-center gap-1.5 mb-1'>
                        <div className='w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0'>
                            DV
                        </div>
                        <span className='text-[10px] text-gray-400'>Di Động Việt</span>
                    </div>
                )}

                {/* Nội dung tin nhắn */}
                <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${isBot
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                        : 'bg-red-500 text-white rounded-tr-sm'
                        }`}
                >
                    <span>{message.content}</span>
                </div>

                {/* Danh sách sản phẩm */}
                {message.products && message.products.length > 0 && (
                    <div className='mt-2 space-y-1.5'>
                        {message.products.map((product) => (
                            <ChatProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Nút gợi ý / Handover */}
                {message.suggestedButtons && message.suggestedButtons.length > 0 && (
                    <QuickButtons
                        buttons={message.suggestedButtons}
                        onButtonClick={onButtonClick}
                        isHandover={message.isHandover}
                    />
                )}
            </div>
        </div>
    );
}