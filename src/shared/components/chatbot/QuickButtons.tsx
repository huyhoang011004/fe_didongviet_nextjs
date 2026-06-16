'use client';

interface QuickButtonsProps {
    buttons: string[];
    onButtonClick: (text: string) => void;
    isHandover?: boolean;
}

export default function QuickButtons({
    buttons,
    onButtonClick,
    isHandover,
}: QuickButtonsProps) {
    if (!buttons || buttons.length === 0) return null;

    // Nếu là handover, hiển thị nút đặc biệt
    if (isHandover && buttons.includes('💬 Chat Messenger')) {
        return (
            <div className='mt-2 space-y-1.5'>
                <p className='text-[11px] text-gray-400 text-center'>
                    Bạn muốn kết nối qua kênh nào?
                </p>
                <div className='flex flex-wrap gap-1.5 justify-center'>
                    {buttons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => onButtonClick(btn)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${btn.includes('Messenger')
                                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                    : btn.includes('Zalo')
                                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='mt-2 flex flex-wrap gap-1.5'>
            {buttons.map((btn, index) => (
                <button
                    key={index}
                    onClick={() => onButtonClick(btn)}
                    className='text-xs font-medium px-3 py-1.5 rounded-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all'
                >
                    {btn}
                </button>
            ))}
        </div>
    );
}