'use client';

import { useInfo } from './useInfo';
import ProfileTab from './_components/ProfileTab';
import AddressesTab from './_components/AddressesTab';
import PasswordTab from './_components/PasswordTab';
import StudentProfileTab from './_components/StudentProfileTab';
import { ShieldCheck, MapPin, Lock, User as UserIcon, CheckCircle, AlertCircle, Award } from 'lucide-react';

const VIETNAM_PROVINCES = [
  { name: 'Hồ Chí Minh', region: 'Nam' },
  { name: 'Hà Nội', region: 'Bac' },
  { name: 'Đà Nẵng', region: 'Trung' },
  { name: 'An Giang', region: 'Nam' },
  { name: 'Bà Rịa - Vũng Tàu', region: 'Nam' },
  { name: 'Bắc Giang', region: 'Bac' },
  { name: 'Bắc Kạn', region: 'Bac' },
  { name: 'Bạc Liêu', region: 'Nam' },
  { name: 'Bắc Ninh', region: 'Bac' },
  { name: 'Bến Tre', region: 'Nam' },
  { name: 'Bình Định', region: 'Trung' },
  { name: 'Bình Dương', region: 'Nam' },
  { name: 'Bình Phước', region: 'Nam' },
  { name: 'Bình Thuận', region: 'Trung' },
  { name: 'Cà Mau', region: 'Nam' },
  { name: 'Cần Thơ', region: 'Nam' },
  { name: 'Cao Bằng', region: 'Bac' },
  { name: 'Đắk Lắk', region: 'Trung' },
  { name: 'Đắk Nông', region: 'Trung' },
  { name: 'Điện Biên', region: 'Bac' },
  { name: 'Đồng Nai', region: 'Nam' },
  { name: 'Đồng Tháp', region: 'Nam' },
  { name: 'Gia Lai', region: 'Trung' },
  { name: 'Hà Giang', region: 'Bac' },
  { name: 'Hà Nam', region: 'Bac' },
  { name: 'Hà Tĩnh', region: 'Trung' },
  { name: 'Hải Dương', region: 'Bac' },
  { name: 'Hải Phòng', region: 'Bac' },
  { name: 'Hậu Giang', region: 'Nam' },
  { name: 'Hòa Bình', region: 'Bac' },
  { name: 'Hưng Yên', region: 'Bac' },
  { name: 'Khánh Hòa', region: 'Trung' },
  { name: 'Kiên Giang', region: 'Nam' },
  { name: 'Kon Tum', region: 'Trung' },
  { name: 'Lai Châu', region: 'Bac' },
  { name: 'Lâm Đồng', region: 'Trung' },
  { name: 'Lạng Sơn', region: 'Bac' },
  { name: 'Lào Cai', region: 'Bac' },
  { name: 'Long An', region: 'Nam' },
  { name: 'Nam Định', region: 'Bac' },
  { name: 'Nghệ An', region: 'Trung' },
  { name: 'Ninh Bình', region: 'Bac' },
  { name: 'Ninh Thuận', region: 'Trung' },
  { name: 'Phú Thọ', region: 'Bac' },
  { name: 'Phú Yên', region: 'Trung' },
  { name: 'Quảng Bình', region: 'Trung' },
  { name: 'Quảng Nam', region: 'Trung' },
  { name: 'Quảng Ngãi', region: 'Trung' },
  { name: 'Quảng Ninh', region: 'Bac' },
  { name: 'Quảng Trị', region: 'Trung' },
  { name: 'Sóc Trăng', region: 'Nam' },
  { name: 'Sơn La', region: 'Bac' },
  { name: 'Tây Ninh', region: 'Nam' },
  { name: 'Thái Bình', region: 'Bac' },
  { name: 'Thái Nguyên', region: 'Bac' },
  { name: 'Thanh Hóa', region: 'Bac' },
  { name: 'Thừa Thiên Huế', region: 'Trung' },
  { name: 'Tiền Giang', region: 'Nam' },
  { name: 'Trà Vinh', region: 'Nam' },
  { name: 'Tuyên Quang', region: 'Bac' },
  { name: 'Vĩnh Long', region: 'Nam' },
  { name: 'Vĩnh Phúc', region: 'Bac' },
  { name: 'Yên Bái', region: 'Bac' }
];

export default function ProfileInfoPage() {
  const {
    user,
    studentProfile,
    studentPending,
    handleSubmitStudentProfile,
    studentProfileRefresh,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    saving,
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
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    alert,
    handleSaveProfile,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleChangePassword,
  } = useInfo();

  if (!user) return null;

  return (
    <div className='space-y-5 animate-in fade-in duration-300'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-3.5 rounded-xl shadow-lg border flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-xs font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TABS HEADER NAVIGATION */}
      <div className='flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1'>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer
            ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
          `}
        >
          <UserIcon size={14} />
          <span>Hồ sơ cá nhân</span>
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer
            ${activeTab === 'student' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
          `}
        >
          <Award size={14} />
          <span>HSSV - Đặc quyền</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer
            ${activeTab === 'addresses' ? 'bg-slate-900 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
          `}
        >
          <MapPin size={14} />
          <span>Sổ địa chỉ</span>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer
            ${activeTab === 'password' ? 'bg-slate-900 text-white shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
          `}
        >
          <Lock size={14} />
          <span>Đổi mật khẩu</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'profile' && (
        <ProfileTab
          user={user}
          editName={editName}
          setEditName={setEditName}
          editPhone={editPhone}
          setEditPhone={setEditPhone}
          saving={saving}
          studentProfile={studentProfile}
          onSave={handleSaveProfile}
          onCancel={() => {
            setEditName(user.name || '');
            setEditPhone(user.phone || '');
            setIsEditing(false);
          }}
        />
      )}

      {activeTab === 'student' && (
        <StudentProfileTab
          studentProfile={studentProfile}
          onSubmit={handleSubmitStudentProfile}
          pending={studentPending}
          onRefresh={studentProfileRefresh}
        />
      )}

      {activeTab === 'addresses' && (
        <AddressesTab
          user={user}
          showAddAddressForm={showAddAddressForm}
          setShowAddAddressForm={setShowAddAddressForm}
          newProvince={newProvince}
          setNewProvince={setNewProvince}
          newDistrict={newDistrict}
          setNewDistrict={setNewDistrict}
          newWard={newWard}
          setNewWard={setNewWard}
          newStreetAddress={newStreetAddress}
          setNewStreetAddress={setNewStreetAddress}
          newIsDefault={newIsDefault}
          setNewIsDefault={setNewIsDefault}
          addressActionLoading={addressActionLoading}
          onAddAddress={handleAddAddress}
          onDeleteAddress={handleDeleteAddress}
          onSetDefaultAddress={handleSetDefaultAddress}
          provinces={VIETNAM_PROVINCES}
        />
      )}

      {activeTab === 'password' && (
        <PasswordTab
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          passwordLoading={passwordLoading}
          showOldPassword={showOldPassword}
          setShowOldPassword={setShowOldPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
}
