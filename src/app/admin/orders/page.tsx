'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useOrder } from './useOrder';
import { OrderHeader } from '@/app/admin/orders/_order-components/OrderHeader';
import { OrderFilters } from '@/app/admin/orders/_order-components/OrderFilters';
import { OrderTable } from '@/app/admin/orders/_order-components/OrderTable';
import { OrderDetailsModal } from '@/app/admin/orders/_order-components/OrderDetailsModal';
import { DeleteOrderModal } from '@/app/admin/orders/_order-components/DeleteOrderModal';

function OrdersAdminContent() {
  const {
    alert,
    ordersData,
    orderLoading,
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    showOrderDetailsModal,
    setShowOrderDetailsModal,
    showDeleteOrderModal,
    setShowDeleteOrderModal,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    handleShipOrder,
    confirmDeleteOrder,
  } = useOrder();

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div
          className={`
            fixed bottom-5 right-5 z-[9999] p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
            ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
          `}
        >
          {alert.type === 'success' ? (
            <CheckCircle className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TIÊU ĐỀ TRANG */}
      <OrderHeader />

      {/* BẢNG ĐƠN HÀNG */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <OrderFilters
          orderSearch={orderSearch}
          setOrderSearch={setOrderSearch}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          filteredCount={filteredOrders.length}
          totalCount={ordersData.length}
        />

        <OrderTable
          orders={filteredOrders}
          loading={orderLoading}
          onViewOrder={(order) => {
            setSelectedOrder(order);
            setShowOrderDetailsModal(true);
          }}
        />
      </Card>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      <OrderDetailsModal
        isOpen={showOrderDetailsModal}
        order={selectedOrder}
        onClose={() => setShowOrderDetailsModal(false)}
        onShip={handleShipOrder}
        onDeleteClick={() => setShowDeleteOrderModal(true)}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <DeleteOrderModal
        isOpen={showDeleteOrderModal}
        onClose={() => setShowDeleteOrderModal(false)}
        onConfirm={confirmDeleteOrder}
        orderId={selectedOrder?._id || ''}
      />
    </div>
  );
}

export default function OrdersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng quản lý đơn hàng...
          </span>
        </div>
      }
    >
      <OrdersAdminContent />
    </Suspense>
  );
}
