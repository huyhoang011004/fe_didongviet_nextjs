import React from 'react';
import { Map, Plus, MapPin, Home, Trash2, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface AddressesTabProps {
  user: any;
  showAddAddressForm: boolean;
  setShowAddAddressForm: (val: boolean) => void;
  newProvince: string;
  setNewProvince: (val: string) => void;
  newDistrict: string;
  setNewDistrict: (val: string) => void;
  newWard: string;
  setNewWard: (val: string) => void;
  newStreetAddress: string;
  setNewStreetAddress: (val: string) => void;
  newIsDefault: boolean;
  setNewIsDefault: (val: boolean) => void;
  addressActionLoading: boolean;
  onAddAddress: (e: React.FormEvent) => void;
  onDeleteAddress: (idx: number) => void;
  onSetDefaultAddress: (idx: number) => void;
  provinces: Array<{ name: string; region: string }>;
}

export default function AddressesTab({
  user,
  showAddAddressForm,
  setShowAddAddressForm,
  newProvince,
  setNewProvince,
  newDistrict,
  setNewDistrict,
  newWard,
  setNewWard,
  newStreetAddress,
  setNewStreetAddress,
  newIsDefault,
  setNewIsDefault,
  addressActionLoading,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  provinces,
}: AddressesTabProps) {
  return (
    <div className='space-y-4 animate-in fade-in duration-200 text-left'>
      <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4.5'>
          <div className='flex items-center gap-2'>
            <Map size={16} className='text-blue-500' />
            <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
              Địa chỉ nhận hàng của tôi
            </h2>
          </div>
          {!showAddAddressForm && (
            <Button
              onClick={() => setShowAddAddressForm(true)}
              className='bg-slate-900 hover:bg-slate-800 text-white text-[10px] h-7.5 px-3 font-bold rounded-lg border-none shadow-sm cursor-pointer flex items-center gap-1.5'
            >
              <Plus size={12} />
              Thêm địa chỉ mới
            </Button>
          )}
        </div>

        {/* FORM THÊM ĐỊA CHỈ */}
        {showAddAddressForm && (
          <form
            onSubmit={onAddAddress}
            className='bg-slate-50 rounded-xl border border-slate-100 p-4.5 mb-5 space-y-4 animate-in slide-in-from-top-3 duration-250'
          >
            <h3 className='text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5'>
              <MapPin size={12} className='text-didongviet-red' />
              Nhập thông tin địa chỉ mới
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3.5'>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>Tỉnh / Thành phố *</label>
                <select
                  value={newProvince}
                  onChange={(e) => setNewProvince(e.target.value)}
                  className='w-full h-9.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white px-2.5 focus:border-slate-800 focus:outline-none transition-colors cursor-pointer'
                >
                  {provinces.map((prov) => (
                    <option key={prov.name} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>Quận / Huyện *</label>
                <Input
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder='Ví dụ: Quận 1, Huyện Hóc Môn...'
                  className='text-xs h-9.5 rounded-xl bg-white border-slate-200'
                  required
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>Phường / Xã *</label>
                <Input
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                  placeholder='Ví dụ: Phường Bến Nghé...'
                  className='text-xs h-9.5 rounded-xl bg-white border-slate-200'
                  required
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>Địa chỉ cụ thể (Số nhà, tên đường, ngõ hẻm...) *</label>
              <Input
                value={newStreetAddress}
                onChange={(e) => setNewStreetAddress(e.target.value)}
                placeholder='Ví dụ: 79 Trần Quang Khải'
                className='text-xs h-9.5 rounded-xl bg-white border-slate-200'
                required
              />
            </div>

            <div className='flex items-center gap-2 pt-1'>
              <input
                type='checkbox'
                id='newIsDefault'
                checked={newIsDefault}
                onChange={(e) => setNewIsDefault(e.target.checked)}
                className='h-3.5 w-3.5 rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red cursor-pointer'
              />
              <label
                htmlFor='newIsDefault'
                className='text-[10px] font-bold text-slate-650 select-none cursor-pointer'
              >
                Đặt địa chỉ này làm mặc định để ưu tiên nhận hàng
              </label>
            </div>

            <div className='flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50'>
              <Button
                type='button'
                onClick={() => setShowAddAddressForm(false)}
                variant='outline'
                className='text-[10px] h-8 font-bold border-slate-200 rounded-lg cursor-pointer px-4'
              >
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                disabled={addressActionLoading}
                className='bg-didongviet-red hover:bg-red-700 text-white text-[10px] h-8 font-bold border-none rounded-lg shadow-sm px-4 cursor-pointer disabled:opacity-50'
              >
                {addressActionLoading ? 'Đang lưu...' : 'Lưu địa chỉ'}
              </Button>
            </div>
          </form>
        )}

        {/* DANH SÁCH ĐỊA CHỈ */}
        {(!user.address || user.address.length === 0) ? (
          <div className='text-center py-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl'>
            <MapPin size={24} className='mx-auto text-slate-300 mb-2' />
            <p className='text-[10px] font-semibold text-slate-400'>
              Bạn chưa lưu địa chỉ nhận hàng nào.
            </p>
            <p className='text-[9px] text-slate-400 mt-0.5'>
              Thêm địa chỉ để quá trình đặt hàng diễn ra siêu tốc!
            </p>
          </div>
        ) : (
          <div className='space-y-3.5'>
            {user.address.map((addr: any, idx: number) => (
              <div
                key={addr._id || idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200
                  ${addr.isDefault
                    ? 'bg-red-50/20 border-red-200 shadow-2xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className='space-y-1.5 flex-1 pr-4'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='inline-flex items-center gap-1 text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg'>
                      <Home size={10} className='text-slate-455' />
                      Địa chỉ #{idx + 1}
                    </span>
                    {addr.isDefault && (
                      <span className='inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-didongviet-red bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md'>
                        <Check size={8} className='stroke-[4]' />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className='text-xs font-bold text-slate-700 leading-relaxed'>
                    {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>

                <div className='flex items-center gap-2 mt-3 sm:mt-0 flex-shrink-0 self-end sm:self-center'>
                  {!addr.isDefault && (
                    <button
                      onClick={() => onSetDefaultAddress(idx)}
                      disabled={addressActionLoading}
                      className='text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors disabled:opacity-50'
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteAddress(idx)}
                    disabled={addressActionLoading}
                    className='text-[9px] font-bold text-red-650 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50'
                  >
                    <Trash2 size={10} />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
