'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { verifyOtpAction, resendOtpAction } from './actions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function VerifyOtpForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const isFromUnverifiedLogin = searchParams.get('unverified') === 'true';

  const [state, formAction, isPending] = useActionState(verifyOtpAction, {
    success: false,
    error: null,
    message: null,
  });

  // State quản lý gửi lại OTP
  const [countdown, setCountdown] = useState(60);
  const [isResendPending, startResendTransition] = useTransition();
  const [resendStatus, setResendStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Lưu trữ mã OTP từ 6 ô input độc lập
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Đếm ngược thời gian gửi lại OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Điều hướng khi xác thực thành công
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/login?activated=true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  // Nhập OTP nhảy sang ô tiếp theo
  const handleOtpChange = (index: number, value: string) => {
    // Chỉ chấp nhận chữ số
    if (value && !/^\d+$/.test(value)) return;

    const newValues = [...otpValues];
    // Lấy ký tự cuối cùng nhập vào (đề phòng copy-paste hoặc double-tap)
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);

    // Tự động chuyển tiêu điểm sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Nhấn Backspace nhảy ngược lại
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = '';
        setOtpValues(newValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValues = [...otpValues];
        newValues[index] = '';
        setOtpValues(newValues);
      }
    }
  };

  // Paste mã OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newValues = pastedData.split('');
    setOtpValues(newValues);
    inputRefs.current[5]?.focus();
  };

  // Trình xử lý gửi lại mã OTP
  const handleResend = () => {
    if (countdown > 0 || isResendPending) return;

    setResendStatus(null);
    startResendTransition(async () => {
      const res = await resendOtpAction(email);
      if (res.success) {
        setCountdown(60); // Reset bộ đếm
        setResendStatus({ success: true, message: res.message });
      } else {
        setResendStatus({ success: false, message: res.message });
      }
    });
  };

  // Ghép các ô OTP lại trước khi Submit
  const fullOtpCode = otpValues.join('');

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0 border border-border shadow-lg'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='p-6 md:p-8 flex flex-col justify-center'>
            <div className='flex flex-col items-center gap-2 text-center mb-6'>
              <h1 className='text-2xl font-bold text-didongviet-red'>Xác thực tài khoản</h1>
              <p className='text-sm text-muted-foreground'>
                {isFromUnverifiedLogin 
                  ? 'Tài khoản của bạn chưa được kích hoạt.' 
                  : 'Đăng ký bước đầu thành công.'}
              </p>
              <p className='text-sm text-balance text-muted-foreground font-medium mt-1 bg-muted px-3 py-1.5 rounded-full border border-border max-w-full truncate'>
                {email || 'nguoidung@gmail.com'}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Vui lòng kiểm tra Gmail để lấy mã OTP xác thực gồm 6 chữ số.
              </p>
            </div>

            {/* THÔNG BÁO LỖI HOẶC THÀNH CÔNG */}
            {state.error && (
              <div className='mb-4 p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2 font-medium animate-in fade-in-50 duration-200'>
                <AlertCircle size={16} className='flex-shrink-0' />
                <span>{state.error}</span>
              </div>
            )}

            {state.success && (
              <div className='mb-4 p-3 text-sm bg-green-500/10 border border-green-500/20 text-green-600 rounded-md flex items-center gap-2 font-medium animate-in fade-in-50 duration-200'>
                <CheckCircle2 size={16} className='flex-shrink-0' />
                <span>{state.message || 'Xác thực thành công! Đang chuyển hướng...'}</span>
              </div>
            )}

            {resendStatus && (
              <div className={cn(
                'mb-4 p-3 text-sm border rounded-md flex items-center gap-2 font-medium animate-in fade-in-50 duration-200',
                resendStatus.success 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-600' 
                  : 'bg-destructive/10 border border-destructive/20 text-destructive'
              )}>
                {resendStatus.success ? <CheckCircle2 size={16} className='flex-shrink-0' /> : <AlertCircle size={16} className='flex-shrink-0' />}
                <span>{resendStatus.message}</span>
              </div>
            )}

            <form action={formAction} className='space-y-6'>
              <input type='hidden' name='email' value={email} />
              <input type='hidden' name='otpCode' value={fullOtpCode} />

              <FieldGroup>
                <Field className='flex flex-col items-center gap-3'>
                  <FieldLabel className='text-sm font-semibold text-center w-full'>Nhập mã OTP</FieldLabel>
                  
                  {/* Hàng ô nhập OTP */}
                  <div className='flex gap-2 justify-center w-full my-2' onPaste={handlePaste}>
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        type='text'
                        maxLength={1}
                        value={val}
                        disabled={isPending || state.success}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        className='w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border border-input bg-background focus:border-didongviet-red focus:ring-2 focus:ring-didongviet-red/20 outline-none transition-all disabled:opacity-50 disabled:bg-muted'
                      />
                    ))}
                  </div>
                </Field>

                <Button 
                  type='submit' 
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white py-6 rounded-lg font-semibold transition-all' 
                  disabled={isPending || state.success || fullOtpCode.length !== 6}
                >
                  {isPending ? (
                    <div className='flex items-center justify-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      Đang xác thực...
                    </div>
                  ) : (
                    'Xác nhận'
                  )}
                </Button>

                {/* GỬI LẠI OTP TIMER */}
                <div className='text-center text-sm text-muted-foreground mt-4'>
                  {countdown > 0 ? (
                    <span>Gửi lại mã sau <strong className='text-foreground'>{countdown}s</strong></span>
                  ) : (
                    <button
                      type='button'
                      onClick={handleResend}
                      disabled={isResendPending}
                      className={cn(
                        'text-didongviet-red font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer',
                        isResendPending && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {isResendPending ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
                    </button>
                  )}
                </div>

                <FieldDescription className='text-center mt-6'>
                  <a href='/login' className='text-sm underline-offset-4 hover:underline hover:text-didongviet-red'>
                    Quay lại Đăng nhập
                  </a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
          <div className='relative hidden bg-muted md:flex items-center justify-center p-4'>
            <img
              src='/auth-image.webp'
              alt='OTP Verification'
              className='max-h-[80%] max-w-[80%] object-contain dark:brightness-[0.8]'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
