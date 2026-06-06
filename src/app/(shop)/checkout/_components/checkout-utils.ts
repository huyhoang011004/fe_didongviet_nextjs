// Danh sách 63 tỉnh thành Việt Nam phục vụ việc tính phí ship tự động
export const VIETNAM_PROVINCES = [
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

// Trích xuất tỉnh và miền của chi nhánh để làm căn cứ tính phí ship
export const getBranchRegion = (address: string): { province: string; region: string } => {
  const addr = address.toLowerCase();
  
  if (addr.includes('hồ chí minh') || addr.includes('hcm') || addr.includes('tphcm')) {
    return { province: 'Hồ Chí Minh', region: 'Nam' };
  }
  if (addr.includes('hà nội') || addr.includes('hn')) {
    return { province: 'Hà Nội', region: 'Bac' };
  }
  if (addr.includes('đà nẵng') || addr.includes('đn')) {
    return { province: 'Đà Nẵng', region: 'Trung' };
  }
  if (addr.includes('bình dương') || addr.includes('bd')) {
    return { province: 'Bình Dương', region: 'Nam' };
  }
  if (addr.includes('đồng nai') || addr.includes('đn')) {
    return { province: 'Đồng Nai', region: 'Nam' };
  }

  // Dự phòng tìm kiếm gần đúng
  for (const prov of VIETNAM_PROVINCES) {
    if (addr.includes(prov.name.toLowerCase())) {
      return { province: prov.name, region: prov.region };
    }
  }

  return { province: 'Hồ Chí Minh', region: 'Nam' };
};
