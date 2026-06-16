import { useState, useEffect, useContext, useTransition } from 'react';
import { ProfileContext } from '../layout';
import { updateProfile, changePassword } from './info-actions';
import { fetchStudentProfile, uploadStudentCardFetch, updateStudentProfileFetch } from './student-actions';
import { StudentProfile } from '@/types/student';

export function useInfo() {
  const { user, setUser, studentProfile: contextStudentProfile } = useContext(ProfileContext);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(contextStudentProfile || null);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'student'>('profile');

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

  // State Student Profile
  const [studentPending, startStudent] = useTransition();

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

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setAlert({ type: 'error', message: 'Họ và tên không được để trống' });
      return;
    }
    setSaving(true);
    try {
      const data = await updateProfile({
        name: editName,
        phone: editPhone,
        address: user.address || [],
      });
      if (data.success) {
        setAlert({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
        setIsEditing(false);
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setSaving(false);
    }
  };

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
        isDefault: newIsDefault || (user.address || []).length === 0,
      };

      let currentAddresses = [...(user.address || [])];

      if (newAddrItem.isDefault) {
        currentAddresses = currentAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      currentAddresses.push(newAddrItem);

      const data = await updateProfile({
        name: user.name,
        phone: user.phone,
        address: currentAddresses,
      });

      if (data.success) {
        setAlert({ type: 'success', message: 'Thêm địa chỉ mới thành công!' });
        setUser(data.data);
        setNewProvince('Hồ Chí Minh');
        setNewDistrict('');
        setNewWard('');
        setNewStreetAddress('');
        setNewIsDefault(false);
        setShowAddAddressForm(false);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi khi thêm địa chỉ' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  const handleDeleteAddress = async (indexToDelete: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    setAddressActionLoading(true);
    try {
      const addresses = [...(user.address || [])];
      const wasDefault = addresses[indexToDelete].isDefault;
      addresses.splice(indexToDelete, 1);

      if (wasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }

      const data = await updateProfile({
        name: user.name,
        phone: user.phone,
        address: addresses,
      });

      if (data.success) {
        setAlert({ type: 'success', message: 'Xóa địa chỉ thành công!' });
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi khi xóa địa chỉ' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  const handleSetDefaultAddress = async (indexToDefault: number) => {
    setAddressActionLoading(true);
    try {
      const addresses = (user.address || []).map((addr: any, idx: number) => ({
        ...addr,
        isDefault: idx === indexToDefault,
      }));

      const data = await updateProfile({
        name: user.name,
        phone: user.phone,
        address: addresses,
      });

      if (data.success) {
        setAlert({ type: 'success', message: 'Đã thiết lập địa chỉ mặc định mới!' });
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể thiết lập địa chỉ mặc định' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setAddressActionLoading(false);
    }
  };

  // Refresh student profile từ API (client fetch — tự động gửi cookie)
  const studentProfileRefresh = async () => {
    const result = await fetchStudentProfile();
    if (result.success && result.data) {
      setStudentProfile(result.data);
    }
  };

  // Nộp / Cập nhật hồ sơ HSSV (gửi cả ảnh + thông tin trong 1 lần)
  const handleSubmitStudentProfile = async (formData: FormData) => {
    startStudent(async () => {
      // Bước 1: Upload ảnh thẻ (nếu có file mới)
      const file = formData.get('studentCardImage') as File | null;

      if (file && file.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append('studentCardImage', file);
        const uploadResult = await uploadStudentCardFetch(uploadFormData);
        if (!uploadResult.success) {
          setAlert({ type: 'error', message: uploadResult.message || 'Tải ảnh thẻ thất bại!' });
          return;
        }
      }

      // Bước 2: Cập nhật thông tin
      const studentIdCard = formData.get('studentIdCard') as string;
      const schoolName = formData.get('schoolName') as string;

      const updateResult = await updateStudentProfileFetch({
        studentIdCard: studentIdCard || undefined,
        schoolName: schoolName || undefined,
      });

      if (updateResult.success) {
        setAlert({ type: 'success', message: updateResult.message || 'Cập nhật hồ sơ HSSV thành công!' });
        await studentProfileRefresh();
      } else {
        setAlert({ type: 'error', message: updateResult.message || 'Cập nhật thất bại!' });
      }
    });
  };

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
      const data = await changePassword({ oldPassword, newPassword });
      if (data.success) {
        setAlert({ type: 'success', message: 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAlert({ type: 'error', message: data.message || 'Mật khẩu cũ không chính xác!' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
    user,
    setUser,
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
    setAlert,
    handleSaveProfile,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleChangePassword,
  };
}
