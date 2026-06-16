'use client';

import React, { useRef, useState } from 'react';
import {
    Award,
    Upload,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    RefreshCw,
    FileImage,
    School,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { StudentProfile, HSSVStatus } from '@/types/student';
import { resolveImageUrl } from '@/shared/lib/utils';

interface StudentProfileTabProps {
    studentProfile: StudentProfile | null;
    onSubmit: (formData: FormData) => Promise<void>;
    pending: boolean;
    onRefresh: () => void;
}

const STATUS_CONFIG: Record<HSSVStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    'Chưa xác thực': {
        label: 'Chưa xác thực',
        color: 'text-slate-500',
        bg: 'bg-slate-100 border-slate-200',
        icon: <AlertCircle size={14} />,
    },
    'Đang chờ': {
        label: 'Đang chờ duyệt',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        icon: <Clock size={14} />,
    },
    'Đã xác thực': {
        label: 'Đã xác thực',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
        icon: <CheckCircle size={14} />,
    },
    'Bị từ chối': {
        label: 'Bị từ chối',
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        icon: <XCircle size={14} />,
    },
};

export default function StudentProfileTab({
    studentProfile,
    onSubmit,
    pending,
    onRefresh,
}: StudentProfileTabProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [studentIdCard, setStudentIdCard] = useState(studentProfile?.studentIdCard || '');
    const [schoolName, setSchoolName] = useState(studentProfile?.schoolName || '');
    const [error, setError] = useState<string | null>(null);

    const status = (studentProfile?.isHSSVVerified as HSSVStatus) || 'Chưa xác thực';
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG['Chưa xác thực'];
    const isVerified = status === 'Đã xác thực';

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh hợp lệ');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Kích thước ảnh tối đa 10MB');
            return;
        }

        setError(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentIdCard.trim()) {
            setError('Vui lòng nhập mã số sinh viên');
            return;
        }
        if (!schoolName.trim()) {
            setError('Vui lòng nhập tên trường học');
            return;
        }

        setError(null);

        const formData = new FormData();
        if (selectedFile) {
            formData.append('studentCardImage', selectedFile);
        }
        formData.append('studentIdCard', studentIdCard.trim());
        formData.append('schoolName', schoolName.trim());

        await onSubmit(formData);
    };

    // Reset form khi studentProfile thay đổi
    React.useEffect(() => {
        if (studentProfile) {
            setStudentIdCard(studentProfile.studentIdCard || '');
            setSchoolName(studentProfile.schoolName || '');
        }
    }, [studentProfile]);

    const imageUrl = previewUrl || resolveImageUrl(studentProfile?.studentCardImage);

    return (
        <div className='space-y-4 animate-in fade-in duration-200 text-left'>
            {/* Trạng thái HSSV */}
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5'>
                <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4'>
                    <div className='flex items-center gap-2'>
                        <Award size={16} className='text-purple-500' />
                        <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                            Đặc quyền Học sinh - Sinh viên
                        </h2>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold border flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color}`}
                        >
                            {statusCfg.icon}
                            {statusCfg.label}
                        </span>
                        <button
                            onClick={onRefresh}
                            className='p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer'
                            title='Làm mới'
                        >
                            <RefreshCw size={14} className='text-slate-400' />
                        </button>
                    </div>
                </div>

                {/* Đã xác thực: Chỉ hiển thị thông tin */}
                {isVerified && studentProfile ? (
                    <div className='space-y-4'>
                        <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3'>
                            <CheckCircle size={20} className='text-emerald-500 flex-shrink-0' />
                            <div>
                                <p className='text-xs font-bold text-emerald-700'>
                                    Tài khoản của bạn đã được xác thực HSSV!
                                </p>
                                <p className='text-[10px] text-emerald-600 mt-0.5'>
                                    Bạn đã mở khóa đặc quyền mua sắm với giá ưu đãi dành riêng cho HSSV.
                                </p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <span className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>
                                    Mã số sinh viên
                                </span>
                                <span className='text-xs font-bold text-slate-700 block'>
                                    {studentProfile.studentIdCard || '---'}
                                </span>
                            </div>
                            <div className='space-y-1'>
                                <span className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>
                                    Trường học
                                </span>
                                <span className='text-xs font-bold text-slate-700 block'>
                                    {studentProfile.schoolName || '---'}
                                </span>
                            </div>
                        </div>

                        {studentProfile.studentCardImage && (
                            <div className='space-y-1.5'>
                                <span className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>
                                    Ảnh thẻ sinh viên
                                </span>
                                <div className='bg-slate-50 rounded-xl overflow-hidden border border-slate-200 max-h-[250px] flex items-center justify-center p-2'>
                                    <img
                                        src={resolveImageUrl(studentProfile.studentCardImage)}
                                        alt='Thẻ sinh viên'
                                        className='max-h-[230px] w-auto object-contain rounded-lg'
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/auth-image.webp';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Form nộp / cập nhật hồ sơ (1 form duy nhất) */
                    <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
                        {error && (
                            <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2'>
                                <AlertCircle size={14} className='text-red-500 flex-shrink-0' />
                                <span className='text-[11px] font-semibold text-red-700'>{error}</span>
                            </div>
                        )}

                        {/* Trạng thái chờ duyệt / bị từ chối */}
                        {status === 'Đang chờ' && (
                            <div className='bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2'>
                                <Clock size={16} className='text-amber-500 flex-shrink-0' />
                                <p className='text-[11px] font-semibold text-amber-700'>
                                    Hồ sơ đang chờ xét duyệt. Bạn có thể cập nhật lại thông tin nếu cần.
                                </p>
                            </div>
                        )}

                        {status === 'Bị từ chối' && studentProfile?.rejectedReason && (
                            <div className='bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2'>
                                <XCircle size={16} className='text-red-500 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-[11px] font-bold text-red-700'>
                                        Hồ sơ bị từ chối: {studentProfile.rejectedReason}
                                    </p>
                                    <p className='text-[10px] text-red-600 mt-0.5'>
                                        Vui lòng cập nhật lại thông tin và gửi lại.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Ảnh thẻ sinh viên */}
                        <div className='space-y-1.5'>
                            <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                                <FileImage size={11} />
                                Ảnh chụp thẻ sinh viên (mặt trước)
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className='border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all'
                            >
                                {imageUrl ? (
                                    <div className='space-y-2'>
                                        <img
                                            src={imageUrl}
                                            alt='Thẻ sinh viên'
                                            className='max-h-[180px] mx-auto rounded-lg object-contain'
                                        />
                                        <p className='text-[10px] text-slate-400 font-medium'>
                                            {selectedFile ? 'Nhấp để chọn ảnh khác' : 'Ảnh hiện tại — nhấp để thay ảnh mới'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className='space-y-1.5'>
                                        <Upload size={28} className='mx-auto text-slate-300' />
                                        <p className='text-xs font-semibold text-slate-500'>
                                            Nhấp để chọn ảnh thẻ sinh viên
                                        </p>
                                        <p className='text-[9px] text-slate-400'>
                                            Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB
                                        </p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/jpeg,image/png,image/webp,image/avif'
                                    className='hidden'
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>

                        {/* Thông tin học tập */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='space-y-1'>
                                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                                    <CreditCard size={10} />
                                    Mã số sinh viên
                                </label>
                                <Input
                                    value={studentIdCard}
                                    onChange={(e) => setStudentIdCard(e.target.value)}
                                    placeholder='Ví dụ: B20DCCN123'
                                    className='text-xs h-9 rounded-xl font-semibold bg-white border-slate-200'
                                />
                            </div>
                            <div className='space-y-1'>
                                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                                    <School size={10} />
                                    Tên trường học
                                </label>
                                <Input
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                    placeholder='Ví dụ: Đại học Bách Khoa Hà Nội'
                                    className='text-xs h-9 rounded-xl font-semibold bg-white border-slate-200'
                                />
                            </div>
                        </div>

                        {/* 1 nút duy nhất */}
                        <Button
                            type='submit'
                            disabled={pending}
                            className='w-full bg-didongviet-red hover:bg-red-700 text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md disabled:opacity-50'
                        >
                            {pending ? (
                                <>
                                    <RefreshCw size={14} className='animate-spin mr-1' />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Award size={14} className='mr-1' />
                                    {studentProfile ? 'Cập nhật hồ sơ HSSV' : 'Tạo hồ sơ HSSV'}
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </div>

            {/* Thông tin đặc quyền (chỉ khi chưa xác thực) */}
            {!isVerified && (
                <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-4'>
                    <div className='flex items-start gap-3'>
                        <Award size={18} className='text-purple-500 flex-shrink-0 mt-0.5' />
                        <div>
                            <h3 className='text-xs font-black text-purple-800 mb-1'>
                                Đặc quyền dành riêng cho HSSV
                            </h3>
                            <ul className='space-y-1'>
                                <li className='text-[10px] text-purple-600 flex items-center gap-1.5'>
                                    <CheckCircle size={10} className='text-purple-400' />
                                    Giảm từ 200k - 600k khi mua sắm tại Di Động Việt
                                </li>
                                <li className='text-[10px] text-purple-600 flex items-center gap-1.5'>
                                    <CheckCircle size={10} className='text-purple-400' />
                                    Voucher độc quyền dành riêng cho HSSV đã xác thực
                                </li>
                                <li className='text-[10px] text-purple-600 flex items-center gap-1.5'>
                                    <CheckCircle size={10} className='text-purple-400' />
                                    Ưu đãi trả góp 0% dành cho sinh viên
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}