'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatbotMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
    products?: Array<{
        _id: string;
        name: string;
        imageUrl: string;
        price: number;
        slug: string;
    }>;
    suggestedButtons?: string[];
    isHandover?: boolean;
    timestamp: number;
}

export interface ChatbotResponse {
    intent: 'GREETING' | 'SEARCH_PRODUCT' | 'FAQ' | 'HANDOVER' | 'UNKNOWN';
    reply: string;
    filters: {
        brand: string | null;
        price_min: number | null;
        price_max: number | null;
        feature: string | null;
    };
    faq_type: string | null;
    suggested_buttons: string[];
    products?: string[]; // slugs từ backend
}

const API_URL = '/api/chatbot';
const STORAGE_KEY = 'didongviet_chatbot_messages';

// Ánh xạ button text -> từ khóa tìm kiếm (có ghép context brand)
const BUTTON_TO_KEYWORD: Record<string, string> = {
    'Chụp ảnh đẹp': 'chụp ảnh đẹp',
    'Pin trâu': 'pin trâu',
    'Pin trâu / Cấu hình mạnh': 'pin trâu cấu hình mạnh',
    'Cấu hình mạnh': 'cấu hình mạnh',
    'Chơi game': 'chơi game',
    'Giá rẻ học sinh': 'giá rẻ học sinh',
    'Màn hình gập thời thượng': 'màn hình gập',
    'Máy mới': 'máy mới',
    'Máy cũ': 'máy cũ',
};

export function useChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
    const [lastBotContext, setLastBotContext] = useState<{ brand?: string; feature?: string }>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load từ localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setMessages(parsed);
                if (parsed.length > 1) setHasSentFirstMessage(true);
            }
        } catch { /* ignore */ }
    }, []);

    // Lưu vào localStorage
    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
        catch { /* ignore */ }
    }, [messages]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Tin nhắn chào
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'bot',
                content: '👋 Chào bạn! Chào mừng bạn đến với Di Động Việt!\n\nEm là trợ lý ảo, có thể giúp bạn:\n• 🔍 Tìm điện thoại, laptop theo nhu cầu\n• 📜 Tra cứu chính sách bảo hành\n• 🏪 Xem địa chỉ cửa hàng\n• 🚚 Thông tin vận chuyển\n\nBạn cần em hỗ trợ gì ạ?',
                suggestedButtons: ['Mua điện thoại', 'Mua laptop', 'Chính sách bảo hành', 'Gặp nhân viên'],
                timestamp: Date.now(),
            }]);
        }
    }, [isOpen]);

    // Lấy chi tiết sản phẩm theo slugs từ backend
    const fetchProductsBySlugs = useCallback(async (slugs: string[]): Promise<ChatbotMessage['products']> => {
        try {
            if (!slugs || slugs.length === 0) return [];
            // Fetch từng slug
            const results = await Promise.all(
                slugs.map(async (slug) => {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`);
                    const json = await res.json();
                    return json.success ? json.data : json.product || null;
                })
            );
            return results
                .filter((p): p is any => p !== null)
                .map((p: any) => ({
                    _id: p._id,
                    name: p.name || '',
                    imageUrl: p.imageUrl || p.images?.[0]?.url || '',
                    price: p.priceRange?.min || p.variants?.[0]?.salePrice || p.variants?.[0]?.price || 0,
                    slug: p.slug || p._id,
                }));
        } catch {
            return [];
        }
    }, []);

    // Gửi tin nhắn
    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: ChatbotMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setHasSentFirstMessage(true);
        setIsLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content.trim() }),
            });
            const data = await res.json();

            if (!data.success || !data.data) throw new Error('Invalid response');

            const botResponse: ChatbotResponse = data.data;
            const isHandover = botResponse.intent === 'HANDOVER';

            // Lưu context
            if (botResponse.filters) {
                const ctx: { brand?: string; feature?: string } = {};
                if (botResponse.filters.brand) ctx.brand = botResponse.filters.brand;
                if (botResponse.filters.feature) ctx.feature = botResponse.filters.feature;
                setLastBotContext(ctx);
            }

            // Fetch sản phẩm từ slugs backend trả về
            let products: ChatbotMessage['products'] = [];
            if (botResponse.products && botResponse.products.length > 0) {
                products = await fetchProductsBySlugs(botResponse.products);
            }

            const botMessage: ChatbotMessage = {
                id: `bot_${Date.now()}`,
                role: 'bot',
                content: botResponse.reply,
                products: products && products.length > 0 ? products : undefined,
                suggestedButtons: botResponse.suggested_buttons || undefined,
                isHandover,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch {
            setMessages(prev => [...prev, {
                id: `bot_error_${Date.now()}`,
                role: 'bot',
                content: 'Dạ, hiện tại hệ thống đang có chút trục trặc. Bạn vui lòng thử lại sau ạ! 🙏',
                suggestedButtons: ['Thử lại', 'Gặp nhân viên'],
                timestamp: Date.now(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, fetchProductsBySlugs]);

    // Xử lý khi bấm nút
    const handleButtonClick = useCallback((buttonText: string) => {
        if (buttonText === '💬 Chat Messenger') { window.open('https://m.me/didongviet', '_blank'); return; }
        if (buttonText === '💬 Chat Zalo') { window.open('https://zalo.me/didongviet', '_blank'); return; }
        if (buttonText === 'Gặp nhân viên') { sendMessage('Gặp nhân viên'); return; }

        if (buttonText === 'Xem chi tiết' || buttonText === 'So sánh') {
            for (let i = messages.length - 1; i >= 0; i--) {
                const msg = messages[i];
                if (msg.role === 'bot' && msg.products && msg.products.length > 0) {
                    window.open(`/category/${msg.products[0].slug}`, '_blank');
                    return;
                }
            }
        }

        if (buttonText === 'Xem tất cả') { sendMessage('Xem tất cả sản phẩm'); return; }
        if (buttonText === 'Xem thêm tin tức') { sendMessage('tin công nghệ mới nhất'); return; }

        // Nút feature - ghép context brand
        const keyword = BUTTON_TO_KEYWORD[buttonText];
        if (keyword) {
            if (lastBotContext.brand) {
                sendMessage(`tìm điện thoại ${lastBotContext.brand.toLowerCase()} ${keyword}`);
            } else {
                sendMessage(keyword);
            }
            return;
        }

        sendMessage(buttonText);
    }, [sendMessage, messages, lastBotContext]);

    const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);
    const clearMessages = useCallback(() => {
        setMessages([]);
        setHasSentFirstMessage(false);
        localStorage.removeItem(STORAGE_KEY);
        setLastBotContext({});
    }, []);

    return {
        isOpen, messages, isLoading, hasSentFirstMessage, messagesEndRef,
        sendMessage, handleButtonClick, toggleChat, clearMessages,
    };
}