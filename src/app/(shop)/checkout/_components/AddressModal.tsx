'use client';

import React, { useState } from 'react';
import { VIETNAM_PROVINCES } from './checkout-utils';

// We import Input and Button locally to match project UI
import { Button } from '@/shared/components/ui/button';
import { Input as CustomInput } from '@/shared/components/ui/input';

interface AddressModalProps {
  showAddressModal: boolean;
  setShowAddressModal: (show: boolean) => void;
  profile: any;
  setProfile: (profile: any) => void;
  setProvince: (prov: string) => void;
  setDistrict: (dist: string) => void;
  setWard: (wrd: string) => void;
  setStreetAddress: (addr: string) => void;
  setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
}

export default function AddressModal({
  showAddressModal,
  setShowAddressModal,
  profile,
  setProfile,
  setProvince,
  setDistrict,
  setWard,
  setStreetAddress,
  setAlert,
}: AddressModalProps) {
  const [showNewAddressFormInCheckout, setShowNewAddressFormInCheckout] = useState(false);
  const [newProvince, setNewProvince] = useState('Hồ Chí Minh');
  const [newDistrict, setNewDistrict] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [addressActionLoading, setAddressActionLoading] = useState(false);

  if (!showAddressModal || !profile) return null;

  // Hàm thiết lập mặc định địa chỉ trực tiếp ở Checkout
  const handleSetDefaultAddressInCheckout = async (idxToDefault: number) => {
    setAddressActionLoading(true);
    try {
      const addresses = (profile.address || []).map((addr: any, idx: number) => ({
        ...addr,
        isDefault: idx === idxToDefault,
      }));

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: addresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Thiết lập địa chỉ mặc định mới thành công!' });
        setProfile(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể thiết lập địa chỉ mặc định' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  // Hàm thêm địa chỉ mới trực tiếp ở Checkout
  const handleAddAddressInCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrict.trim() || !newWard.trim() || !newStreetAddress.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ các thông tin địa chỉ mới!' });
      return;
    }

    setAddressActionLoading(true);
    try {
      const newAddr = {
        province: newProvince,
        district: newDistrict,
        ward: newWard,
        streetAddress: newStreetAddress,
        isDefault: newIsDefault || (profile.address || []).length === 0,
      };

      let currentAddresses = [...(profile.address || [])];
      if (newAddr.isDefault) {
        currentAddresses = currentAddresses.map((addr: any) => ({ ...addr, isDefault: false }));
      }
      currentAddresses.push(newAddr);

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: currentAddresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Thêm và áp dụng địa chỉ mới thành công!' });
        setProfile(data.data);
        
        // Tự động điền địa chỉ mới vào Form Checkout
        setProvince(newAddr.province);
        setDistrict(newAddr.district);
        setWard(newAddr.ward);
        setStreetAddress(newAddr.streetAddress);

        // Reset form
        setNewProvince('Hồ Chí Minh');
        setNewDistrict('');
        setNewWard('');
        setNewStreetAddress('');
        setNewIsDefault(false);
        setShowNewAddressFormInCheckout(false);
        setShowAddressModal(false);
      } else {
        setAlert({ type: 'error', message: data.message || 'Lỗi khi thêm địa chỉ' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4 flex-shrink-0'>
          <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5'>
            <span className='text-didongviet-red flex items-center'><MapPinIcon /></span>
            Sổ địa chỉ của tôi
          </h3>
          <button
            onClick={() => setShowAddressModal(false)}
            className='text-slate-400 hover:text-slate-600 text-lg font-bold p-1 bg-transparent border-none cursor-pointer'
          >
            ×
          </button>
        </div>

        <div className='flex-1 overflow-y-auto pr-1 space-y-4'>
          {/* Form thêm địa chỉ mới trong checkout */}
          {showNewAddressFormInCheckout ? (
            <form
              onSubmit={handleAddAddressInCheckout}
              className='bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3.5'
            >
              <h4 className='text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2'>
                Nhập địa chỉ mới
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='space-y-1'>
                  <label className='text-[8px] font-black text-slate-500 uppercase tracking-wider block'>Tỉnh/Thành phố *</label>
                  <select
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className='w-full h-9.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2 focus:border-slate-800 focus:outline-none transition-colors cursor-pointer'
                  >
                    {VIETNAM_PROVINCES.map((prov) => (
                      <option key={prov.name} value={prov.name}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-1'>
                  <label className='text-[8px] font-black text-slate-500 uppercase tracking-wider block'>Quận/Huyện *</label>
                  <CustomInput
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder='Ví dụ: Quận 1'
                    className='text-xs h-9.5 rounded-lg'
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[8px] font-black text-slate-500 uppercase tracking-wider block'>Phường/Xã *</label>
                  <CustomInput
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    placeholder='Ví dụ: Phường Bến Nghé'
                    className='text-xs h-9.5 rounded-lg'
                    required
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-[8px] font-black text-slate-500 uppercase tracking-wider block'>Địa chỉ cụ thể *</label>
                <CustomInput
                  value={newStreetAddress}
                  onChange={(e) => setNewStreetAddress(e.target.value)}
                  placeholder='Số nhà, tên đường...'
                  className='text-xs h-9.5 rounded-lg'
                  required
                />
              </div>

              <div className='flex items-center gap-2 pt-0.5'>
                <input
                  type='checkbox'
                  id='newIsDefaultCheckout'
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className='h-3.5 w-3.5 rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red cursor-pointer'
                />
                <label
                  htmlFor='newIsDefaultCheckout'
                  className='text-[9px] font-bold text-slate-600 select-none cursor-pointer'
                >
                  Đặt địa chỉ này làm mặc định trong hồ sơ
                </label>
              </div>

              <div className='flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50'>
                <button
                  type='button'
                  onClick={() => setShowNewAddressFormInCheckout(false)}
                  className='text-[9px] font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer'
                >
                  Hủy bỏ
                </button>
                <button
                  type='submit'
                  disabled={addressActionLoading}
                  className='bg-didongviet-red hover:bg-red-700 text-white text-[9px] font-bold border-none rounded-lg shadow-sm px-3.5 py-1.5 cursor-pointer disabled:opacity-50'
                >
                  {addressActionLoading ? 'Đang lưu...' : 'Lưu & Áp dụng'}
                </button>
              </div>
            </form>
          ) : (
            <div className='flex justify-end mb-2'>
              <button
                onClick={() => setShowNewAddressFormInCheckout(true)}
                className='bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1'
              >
                <span className='flex items-center'><PlusIcon /></span>
                Thêm địa chỉ mới
              </button>
            </div>
          )}

          {/* Danh sách các địa chỉ */}
          <div className='space-y-3.5 max-h-[45vh] overflow-y-auto pr-1'>
            {(!profile.address || profile.address.length === 0) ? (
              <div className='text-center py-8 text-[10px] text-slate-400 font-semibold'>
                Chưa có địa chỉ nào được lưu trong sổ địa chỉ.
              </div>
            ) : (
              profile.address.map((addr: any, idx: number) => (
                <div
                  key={addr._id || idx}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150
                    ${addr.isDefault 
                      ? 'border-red-200 bg-red-50/10' 
                      : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className='space-y-1.5 flex-1'>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                      <span className='text-[8px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>
                        Địa chỉ #{idx + 1}
                      </span>
                      {addr.isDefault && (
                        <span className='text-[8px] font-black text-didongviet-red bg-red-50 border border-red-100 px-1.5 py-0.2 rounded uppercase tracking-wider'>
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className='text-xs font-bold text-slate-700 leading-normal'>
                      {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>

                  <div className='flex items-center gap-2 self-end sm:self-center shrink-0'>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddressInCheckout(idx)}
                        disabled={addressActionLoading}
                        className='text-[8px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1.2 rounded border-none cursor-pointer transition-colors disabled:opacity-50'
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setProvince(addr.province);
                        setDistrict(addr.district);
                        setWard(addr.ward);
                        setStreetAddress(addr.streetAddress);
                        setShowAddressModal(false);
                        setAlert({ type: 'success', message: 'Đã áp dụng địa chỉ!' });
                      }}
                      className='text-[8px] font-black text-white bg-didongviet-red hover:bg-red-700 px-2.5 py-1.5 rounded border-none cursor-pointer transition-all hover:scale-102 active:scale-98'
                    >
                      Giao đến đây
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon local helper
function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );
}
