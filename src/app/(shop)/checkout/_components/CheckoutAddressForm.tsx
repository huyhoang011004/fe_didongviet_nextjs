'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { VIETNAM_PROVINCES } from './checkout-utils';

interface CheckoutAddressFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  ward: string;
  setWard: (value: string) => void;
  streetAddress: string;
  setStreetAddress: (value: string) => void;
  profile: any;
  setShowAddressModal: (value: boolean) => void;
}

export default function CheckoutAddressForm({
  fullName,
  setFullName,
  phone,
  setPhone,
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  streetAddress,
  setStreetAddress,
  profile,
  setShowAddressModal,
}: CheckoutAddressFormProps) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4'>
      <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center justify-between border-b border-slate-50 pb-3'>
        <div className='flex items-center gap-2'>
          <MapPin size={15} className='text-didongviet-red' />
          Địa chỉ nhận hàng
        </div>
        {profile && (
          <button
            type='button'
            onClick={() => setShowAddressModal(true)}
            className='text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors'
          >
            Sổ địa chỉ của tôi
          </button>
        )}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Họ và tên *
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Nhập tên người nhận'
            className='text-xs h-10 rounded-xl'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Số điện thoại *
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Nhập số điện thoại nhận hàng'
            className='text-xs h-10 rounded-xl'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Tỉnh / Thành phố *
          </label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className='w-full text-xs h-10 rounded-xl border border-slate-200 bg-white px-3 focus:outline-none focus:ring-1 focus:ring-didongviet-red/30'
          >
            {VIETNAM_PROVINCES.map((prov) => (
              <option key={prov.name} value={prov.name}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Quận / Huyện *
          </label>
          <Input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder='VD: Quận 1'
            className='text-xs h-10 rounded-xl'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Phường / Xã *
          </label>
          <Input
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder='VD: Phường Bến Nghé'
            className='text-xs h-10 rounded-xl'
          />
        </div>
      </div>

      <div className='space-y-1.5'>
        <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
          Số nhà, tên đường *
        </label>
        <Input
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder='VD: 75 Nguyễn Bỉnh Khiêm'
          className='text-xs h-10 rounded-xl'
        />
      </div>
    </div>
  );
}
