'use client';

import { MessageCircle, X } from 'lucide-react';
import { useChatbot } from './useChatbot';
import ChatbotWindow from './ChatbotWindow';

export default function ChatbotWidget() {
    const {
        isOpen,
        messages,
        isLoading,
        messagesEndRef,
        sendMessage,
        handleButtonClick,
        toggleChat,
        clearMessages,
    } = useChatbot();

    return (
        <div className='fixed bottom-6 right-6 z-50'>
            {/* Chat window */}
            {isOpen && (
                <ChatbotWindow
                    messages={messages}
                    isLoading={isLoading}
                    messagesEndRef={messagesEndRef}
                    onSendMessage={sendMessage}
                    onButtonClick={handleButtonClick}
                    onClose={toggleChat}
                    onClear={clearMessages}
                />
            )}

            {/* Nút mở/đóng chat */}
            <button
                onClick={toggleChat}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
                        ? 'bg-gray-700 rotate-90'
                        : 'bg-gradient-to-r from-red-500 to-red-600 animate-bounce-short'
                    }`}
                aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
            >
                {isOpen ? (
                    <X size={24} className='text-white' />
                ) : (
                    <MessageCircle size={24} className='text-white' />
                )}
            </button>

            {/* Badge thông báo */}
            {!isOpen && messages.length <= 1 && (
                <div className='absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-900 shadow-md'>
                    1
                </div>
            )}
        </div>
    );
}