'use client';

import { useState, useContext, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  AlertCircle,
  MapPin,
  Lock,
  User as UserIcon,
  Plus,
  Trash2,
  Check,
  Home,
  Map,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ProfileContext } from '../layout';

// Danh sách 63 tỉnh thành Việt Nam
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
  const { user, setUser, studentProfile } = useContext(ProfileContext);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password'>('profile');

  // State Tab 1: Hồ sơ
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // State Tab 2: Địa chỉ
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newProvince, setNewProvince] = useState('Hồ Chí Minh');
  const [newDistrict, setNewDistrict] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [addressActionLoading, setAddressActionLoading] = useState(false);

  // State Tab 3: Mật khẩu
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Hàm lưu thông tin cá nhân
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setAlert({ type: 'error', message: 'Họ và tên không được để trống' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: user.address || [], // Gửi kèm địa chỉ cũ để tránh ghi đè làm mất dữ liệu
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
        setIsEditing(false);
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setSaving(false);
    }
  };

  // Hàm lưu địa chỉ mới
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrict.trim() || !newWard.trim() || !newStreetAddress.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ các trường địa chỉ!' });
      return;
    }

    setAddressActionLoading(true);
    try {
      const newAddrItem = {
        province: newProvince,
        district: newDistrict,
        ward: newWard,
        streetAddress: newStreetAddress,
        isDefault: newIsDefault || (user.address || []).length === 0, // Nếu chưa có địa chỉ nào thì tự động làm mặc định
      };

      let currentAddresses = [...(user.address || [])];

      // Nếu địa chỉ mới là mặc định, chuyển các địa chỉ khác thành không mặc định
      if (newAddrItem.isDefault) {
        currentAddresses = currentAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      currentAddresses.push(newAddrItem);

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: currentAddresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Thêm địa chỉ mới thành công!' });
        setUser(data.data);
        // Reset form
        setNewProvince('Hồ Chí Minh');
        setNewDistrict('');
        setNewWard('');
        setNewStreetAddress('');
        setNewIsDefault(false);
        setShowAddAddressForm(false);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi khi thêm địa chỉ' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  // Hàm xóa địa chỉ
  const handleDeleteAddress = async (indexToDelete: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    setAddressActionLoading(true);
    try {
      const addresses = [...(user.address || [])];
      const wasDefault = addresses[indexToDelete].isDefault;
      addresses.splice(indexToDelete, 1);

      // Nếu địa chỉ bị xóa là mặc định và vẫn còn địa chỉ khác, đặt cái đầu tiên làm mặc định
      if (wasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: addresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Xóa địa chỉ thành công!' });
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi khi xóa địa chỉ' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  // Hàm đặt làm địa chỉ mặc định
  const handleSetDefaultAddress = async (indexToDefault: number) => {
    setAddressActionLoading(true);
    try {
      const addresses = (user.address || []).map((addr: any, idx: number) => ({
        ...addr,
        isDefault: idx === indexToDefault,
      }));

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: addresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Đã thiết lập địa chỉ mặc định mới!' });
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể thiết lập địa chỉ mặc định' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  // Hàm đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ các trường mật khẩu!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Mật khẩu mới và Xác nhận mật khẩu không trùng khớp!' });
      return;
    }
    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: 'success', message: 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAlert({ type: 'error', message: data.message || 'Mật khẩu cũ không chính xác!' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setPasswordLoading(false);
    }
  };

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

      {/* TAB 1: HỒ SƠ CÁ NHÂN */}
      {activeTab === 'profile' && (
        <div className='space-y-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4'>
              <div className='flex items-center gap-2'>
                <ShieldCheck size={16} className='text-emerald-500' />
                <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                  Hồ sơ cá nhân
                </h2>
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={() => {
                    setEditName(user.name || '');
                    setEditPhone(user.phone || '');
                  }}
                  variant='outline'
                  size='sm'
                  className='text-[10px] h-7 font-bold border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50'
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  size='sm'
                  className='bg-didongviet-red hover:bg-red-700 text-white text-[10px] h-7 font-bold shadow-xs border-none rounded-lg cursor-pointer disabled:opacity-50'
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Họ và tên</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='text-xs h-9.5 rounded-xl font-semibold bg-white border-slate-200'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Địa chỉ Email (Cố định)</label>
                <Input
                  value={user.email}
                  disabled
                  className='text-xs h-9.5 rounded-xl font-semibold bg-slate-50/70 border-transparent text-slate-400'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Số điện thoại</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder='Chưa cập nhật số điện thoại'
                  className='text-xs h-9.5 rounded-xl font-semibold bg-white border-slate-200'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Nhóm khách hàng</label>
                <Input
                  value={
                    user.role === 'admin'
                      ? 'Quản trị viên (Admin)'
                      : user.role === 'staff' ? 'Nhân viên (Staff)' : 'Khách hàng (User)'
                  }
                  disabled
                  className='text-xs h-9.5 rounded-xl font-semibold bg-slate-50/70 border-transparent text-purple-600 font-bold'
                />
              </div>
            </div>
          </div>

          {/* Thông tin HSSV nếu có */}
          {studentProfile && (
            <div className='bg-blue-50/50 rounded-xl border border-blue-100 shadow-xs p-5'>
              <div className='flex items-center gap-2 border-b border-blue-100/50 pb-3 mb-4'>
                <Award size={16} className='text-blue-500' />
                <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                  Hồ sơ Học sinh - Sinh viên
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                    studentProfile.isHSSVVerified === 'Đã xác thực'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}
                >
                  {studentProfile.isHSSVVerified}
                </span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='space-y-1'>
                  <span className='text-[9px] font-black text-slate-400 uppercase block'>Trường học</span>
                  <span className='text-xs font-bold text-slate-700 block truncate'>
                    {studentProfile.schoolName}
                  </span>
                </div>
                <div className='space-y-1'>
                  <span className='text-[9px] font-black text-slate-400 uppercase block'>Mã số sinh viên</span>
                  <span className='text-xs font-bold text-slate-700 block'>
                    {studentProfile.studentId}
                  </span>
                </div>
                <div className='space-y-1'>
                  <span className='text-[9px] font-black text-slate-400 uppercase block'>Năm tốt nghiệp dự kiến</span>
                  <span className='text-xs font-bold text-slate-700 block'>
                    {new Date(studentProfile.graduationDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SỔ ĐỊA CHỈ */}
      {activeTab === 'addresses' && (
        <div className='space-y-4 animate-in fade-in duration-200'>
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

            {/* FORM THÊM ĐỊA CHỈ collapse */}
            {showAddAddressForm && (
              <form
                onSubmit={handleAddAddress}
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
                      {VIETNAM_PROVINCES.map((prov) => (
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
                      className='text-xs h-9.5 rounded-xl'
                      required
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>Phường / Xã *</label>
                    <Input
                      value={newWard}
                      onChange={(e) => setNewWard(e.target.value)}
                      placeholder='Ví dụ: Phường Bến Nghé...'
                      className='text-xs h-9.5 rounded-xl'
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
                    className='text-xs h-9.5 rounded-xl'
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
                    className='text-[10px] font-bold text-slate-600 select-none cursor-pointer'
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

            {/* DANH SÁCH ĐỊA CHỈ CỦA USER */}
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
                          <Home size={10} className='text-slate-500' />
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
                          onClick={() => handleSetDefaultAddress(idx)}
                          disabled={addressActionLoading}
                          className='text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors disabled:opacity-50'
                        >
                          Đặt mặc định
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        disabled={addressActionLoading}
                        className='text-[9px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50'
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
      )}

      {/* TAB 3: ĐỔI MẬT KHẨU */}
      {activeTab === 'password' && (
        <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8 animate-in fade-in duration-200 max-w-lg mx-auto w-full'>
          <div className='border-b border-slate-100 pb-3.5 mb-5 text-center'>
            <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-2'>
              <Lock size={15} className='text-amber-500' />
              Đổi mật khẩu tài khoản
            </h2>
            <p className='text-[9px] text-slate-400 font-medium mt-0.5'>
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu mới cho người khác
            </p>
          </div>

          <form onSubmit={handleChangePassword} className='max-w-md mx-auto space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
                Mật khẩu hiện tại *
              </label>
              <div className='relative'>
                <Input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder='Nhập mật khẩu hiện tại'
                  className='text-xs h-9.5 rounded-xl pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
                >
                  {showOldPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
                Mật khẩu mới *
              </label>
              <div className='relative'>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)'
                  className='text-xs h-9.5 rounded-xl pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
                Xác nhận mật khẩu mới *
              </label>
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Nhập lại mật khẩu mới'
                  className='text-xs h-9.5 rounded-xl pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <Button
              type='submit'
              disabled={passwordLoading}
              className='w-full bg-didongviet-red hover:bg-red-700 text-white text-[10px] h-9.5 px-4 font-bold border-none rounded-lg shadow-sm cursor-pointer disabled:opacity-50 mt-2'
            >
              {passwordLoading ? 'Đang xử lý...' : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
