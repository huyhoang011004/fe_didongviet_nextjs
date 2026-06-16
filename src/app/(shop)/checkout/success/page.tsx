"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  ShoppingBag,
  ClipboardList,
  Clock,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "COD";
  const total = searchParams.get("total") || "";
  const vnpResponseCode = searchParams.get("vnp_ResponseCode") || "";
  const momoResultCode = searchParams.get("resultCode") || "";

  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const isOnlinePayment = paymentMethod === "MOMO" || paymentMethod === "VNPAY";

  // Gọi verify endpoint khi user trở về từ cổng thanh toán
  useEffect(() => {
    if (!isOnlinePayment || !orderId) return;

    const hasVNPayParams = paymentMethod === "VNPAY" && vnpResponseCode;
    const hasMoMoParams = paymentMethod === "MOMO" && momoResultCode;
    if (!hasVNPayParams && !hasMoMoParams) return;

    async function verifyPayment() {
      setVerifying(true);
      try {
        const verifyUrl =
          paymentMethod === "VNPAY"
            ? `/api/payments/vnpay/verify?${searchParams.toString()}`
            : `/api/payments/momo/return?${searchParams.toString()}`;

        const res = await fetch(verifyUrl);
        const data = await res.json();
        if (data.success) {
          setVerified(true);
        }
      } catch (err) {
        console.error("Lỗi xác minh thanh toán:", err);
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [isOnlinePayment, orderId, paymentMethod, vnpResponseCode, momoResultCode, searchParams]);

  const isPaymentSuccess =
    !isOnlinePayment ||
    verified ||
    (paymentMethod === "VNPAY" && vnpResponseCode === "00") ||
    (paymentMethod === "MOMO" && (momoResultCode === "0" || momoResultCode === ""));

  const formatVND = (numStr: string) => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "MOMO":
        return "Ví điện tử MoMo";
      case "VNPAY":
        return "Cổng thanh toán VNPay";
      default:
        return method;
    }
  };

  // Countdown redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace("/profile/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Animated Icon */}
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full animate-bounce ${isPaymentSuccess ? "bg-green-50" : "bg-amber-50"}`}
        >
          {isPaymentSuccess ? (
            <CheckCircle size={48} className="text-green-600 animate-pulse" />
          ) : (
            <AlertTriangle size={48} className="text-amber-500 animate-pulse" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {verifying
              ? "ĐANG XÁC MINH THANH TOÁN..."
              : isPaymentSuccess
                ? "ĐẶT HÀNG THÀNH CÔNG!"
                : "ĐANG XỬ LÝ THANH TOÁN"}
          </h1>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            {verifying
              ? "Vui lòng đợi trong giây lát..."
              : isPaymentSuccess
                ? "Cảm ơn bạn đã tin tưởng mua sắm tại Di Động Việt. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý."
                : `Đơn hàng của bạn đã được tạo. Vui lòng hoàn tất thanh toán qua ${getPaymentMethodLabel(paymentMethod)}.`}
          </p>
        </div>

        {/* Order details block */}
        {(orderId || total) && (
          <div className="bg-slate-50/70 rounded-2xl p-4 text-left border border-slate-100 text-xs font-medium space-y-2">
            {orderId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-slate-800">
                  {orderId}
                </span>
              </div>
            )}
            {paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Thanh toán:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard size={12} className="text-slate-400" />
                  {getPaymentMethodLabel(paymentMethod)}
                </span>
              </div>
            )}
            {total && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tổng thanh toán:</span>
                <span className="font-bold text-didongviet-red">
                  {formatVND(total)}
                </span>
              </div>
            )}
            {isOnlinePayment && isPaymentSuccess && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle size={10} />
                  Đã thanh toán
                </span>
              </div>
            )}
          </div>
        )}

        {/* Redirect Timer */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl py-2.5 px-4">
          <Clock size={14} className="text-didongviet-red animate-spin" />
          <span>
            Tự động chuyển hướng về trang đơn hàng sau {countdown} giây...
          </span>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            asChild
            className="bg-didongviet-red hover:bg-red-700 text-white font-bold h-11 text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01]"
          >
            <Link href="/profile/orders">
              <ClipboardList size={16} />
              <span>Xem Đơn Hàng Ngay</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-11 text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01]"
          >
            <Link href="/">
              <ShoppingBag size={16} />
              <span>Tiếp Tục Mua Sắm</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent" />
            <div className="absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse">
              DĐV
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500 animate-pulse">
            Đang chuẩn bị thông báo...
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}