# 🎬 KỊCH BẢN PHÂN CẢNH VIDEO DEMO — HỆ THỐNG QUẢN LÝ & BÁN HÀNG DI ĐỘNG VIỆT

**Thời lượng:** ~10 phút  
**Phong cách:** Báo cáo đồ án tốt nghiệp — chuyên nghiệp, tự tin, mạch lạc  
**Công nghệ hiển thị:** Next.js 16 (App Router) + Express.js 5 + MongoDB + Tailwind CSS 4 + Shadcn/ui + Recharts  
**Tác giả:** Nguyễn Văn Huy Hoàng

---

## 📋 Tổng quan các phân đoạn

| Phân đoạn | Thời gian | Nội dung | Khối |
|-----------|-----------|----------|------|
| **1** | 0:00 – 1:30 | Giới thiệu tổng quan & Trang chủ | **Giới thiệu** |
| **2** | 1:30 – 2:30 | Tìm kiếm & Lọc danh mục sản phẩm | **KHÁCH HÀNG** |
| **3** | 2:30 – 3:30 | Chi tiết sản phẩm & Chọn biến thể | **KHÁCH HÀNG** |
| **4** | 3:30 – 4:30 | Đăng nhập, Giỏ hàng & Áp dụng Voucher | **KHÁCH HÀNG** |
| **5** | 4:30 – 5:30 | Đặt hàng & Thanh toán (COD) | **KHÁCH HÀNG** |
| **6** | 5:30 – 7:00 | Dashboard Admin & Quản lý đơn hàng | **QUẢN TRỊ** |
| **7** | 7:00 – 8:00 | Xử lý đơn hàng (State Machine) & Quản lý kho theo chi nhánh | **QUẢN TRỊ** |
| **8** | 8:00 – 9:30 | Tính năng đặc biệt: Bảo mật RBAC, Chặn hết hàng, Hủy đơn + hoàn kho | **ĐẶC BIỆT** |
| **9** | 9:30 – 10:00 | Tổng kết & Cảm ơn Hội đồng | **KẾT THÚC** |

---

## 🎭 KỊCH BẢN CHI TIẾT

---

### ⏱ Phân đoạn 1: 0:00 – 1:30 | Giới thiệu tổng quan & Trang chủ

#### Giao diện hiển thị (Visual)
Màn hình Desktop: **Trang chủ Di Động Việt** (`http://localhost:3000`).

- **Header** (2 dòng):
  - Dòng 1: Thanh marquee chạy ngang + link "Tra cứu đơn hàng" (`/track`) + "Liên hệ" (`/contact`)
  - Dòng 2: Logo Di Động Việt → Nút "Danh mục" (dropdown đa cấp) → Nút "Tin tức" (`/blogs`) → **Ô tìm kiếm HeaderSearch** → **Icon giỏ hàng** (badge số lượng) → **Icon tài khoản**
- **Hero banner / Slider** quảng cáo sản phẩm nổi bật
- **Danh sách danh mục**: Điện thoại thông minh, Laptop, Tablet, Đồng hồ thông minh, Phụ kiện, Máy cũ
- **ProductGrid** dạng lưới 5 cột hiển thị sản phẩm gợi ý
- **Footer** với thông tin liên hệ, địa chỉ chi nhánh

#### Hành động demo (Action)
1. Mở trình duyệt → gõ `http://localhost:3000`
2. Di chuyển chuột qua menu "Danh mục" → quan sát dropdown categories hiện ra
3. Kéo chuột xuống dưới để thấy danh sách sản phẩm và footer

#### Lời thoại (Voice-over)
> "Kính thưa quý Thầy Cô và Hội đồng chấm tốt nghiệp. Em tên là Nguyễn Văn Huy Hoàng, và đây là đồ án tốt nghiệp của em với đề tài: **Phân tích thiết kế và xây dựng hệ thống quản lý và bán hàng trực tuyến cho chuỗi cửa hàng Di Động Việt**."
>
> "Hệ thống được xây dựng trên kiến trúc Client-Server với **Backend sử dụng Node.js, Express.js 5 và MongoDB** — quản lý dữ liệu qua 15 collection với Mongoose ODM. **Frontend sử dụng Next.js 16 App Router** kết hợp với TypeScript, Tailwind CSS 4 và thư viện giao diện Shadcn/ui."
>
> "Đây là giao diện Trang chủ — nơi khách hàng có thể dễ dàng duyệt qua các danh mục sản phẩm, tìm kiếm thiết bị mình mong muốn và trải nghiệm mua sắm trực tuyến một cách liền mạch."

---

### ⏱ Phân đoạn 2: 1:30 – 2:30 | Tìm kiếm & Lọc sản phẩm theo danh mục

#### Giao diện hiển thị (Visual)
Chuyển sang trang danh mục **"Điện thoại thông minh"** (`/dien-thoai-thong-minh`).

- **Breadcrumb**: Trang chủ > Điện thoại thông minh
- **BrandFilters**: Dạng horizontal pills (Apple, Samsung, OPPO, Xiaomi) — khi click vào thì active
- **SortBar**: Dropdown sắp xếp (Mặc định, Giá tăng dần `price_asc`, Giá giảm dần `price_desc`)
- **ProductGrid**: Hiển thị 5 cột, mỗi sản phẩm có ảnh thumbnail, tên, giá (gốc + khuyến mãi), badge giảm giá
- **Phân trang**: currentPage / totalPages ở cuối trang

#### Hành động demo (Action)
1. Click menu "Danh mục" → chọn "Điện thoại thông minh"
2. Click brand filter "Apple" → danh sách lọc chỉ còn iPhone 16 Pro Max và iPhone 16 Pro
3. Click sort "Giá tăng dần" → sản phẩm sắp xếp lại theo giá từ thấp đến cao
4. Click vào sản phẩm **"iPhone 16 Pro Max"** để xem chi tiết

#### Lời thoại (Voice-over)
> "Chúng ta hãy cùng trải nghiệm luồng mua hàng của khách hàng. Đầu tiên, tôi chọn danh mục **'Điện thoại thông minh'**."
>
> "Hệ thống hiển thị tất cả sản phẩm thuộc danh mục này, đồng thời tự động truy vấn cả các danh mục con thông qua trường **ancestors** trong MongoDB — đảm bảo không bỏ sót sản phẩm nào."
>
> "Phía trên là bộ lọc thương hiệu — tôi lọc nhanh chỉ các sản phẩm **Apple**. Ngoài ra, tôi cũng có thể sắp xếp theo giá tăng dần hoặc giảm dần. Hệ thống hỗ trợ **phân trang** với 8 sản phẩm mỗi trang, giúp tối ưu tốc độ tải trang và trải nghiệm người dùng."
>
> "Tôi chọn sản phẩm iPhone 16 Pro Max để xem chi tiết."

---

### ⏱ Phân đoạn 3: 2:30 – 3:30 | Chi tiết sản phẩm & Chọn biến thể

#### Giao diện hiển thị (Visual)
Trang chi tiết sản phẩm **iPhone 16 Pro Max** (`/dien-thoai-thong-minh/iphone-16-pro-max`).

- **Breadcrumb**: Trang chủ > Điện thoại thông minh > iPhone 16 Pro Max
- **Bên trái**: **ProductGallery** — Ảnh chính lớn + danh sách thumbnail bên dưới, có hiệu ứng zoom khi hover
- **Bên phải**:
  - Tên sản phẩm: iPhone 16 Pro Max
  - Giá gốc: 34.990.000₫ (gạch ngang)
  - Giá khuyến mãi: **32.990.000₫** (màu đỏ, nổi bật)
  - Badge: "Giảm 2.000.000₫"
  - **Bộ chọn màu sắc**: Titan Xám (đang active), Titan Vàng
  - **Bộ chọn dung lượng**: 128GB, 256GB (đang active), 512GB, 1TB
  - **Bộ chọn RAM**: 8GB
  - Thông tin: Bảo hành 12 tháng, Trợ giá thu cũ 2.000.000₫, Giảm D.Member 2%
  - Nút "**Thêm vào giỏ hàng**" (primary) + "**Mua ngay**" (outline)
- **Bên dưới**: Tab **ProductInfo** (Mô tả HTML, Thông số kỹ thuật), **ProductReviews** (điểm TB 4.8/5, 1256 đánh giá)

#### Hành động demo (Action)
1. Click chọn màu **"Titan Xám"** (nếu chưa chọn)
2. Click dung lượng **"256GB"** → quan sát giá cập nhật
3. Hover qua ảnh → xem hiệu ứng zoom
4. Scroll xuống phần mô tả sản phẩm và đánh giá
5. Click nút **"Thêm vào giỏ hàng"** → quan sát thông báo thành công + badge giỏ hàng tăng lên 1

#### Lời thoại (Voice-over)
> "Đây là trang chi tiết sản phẩm **iPhone 16 Pro Max**. Mỗi sản phẩm trong hệ thống có thể có nhiều biến thể về màu sắc và cấu hình — dữ liệu được lưu trong mảng **variants** embedded ngay trong Product model, giúp truy vấn nhanh mà không cần join collection."
>
> "Khi tôi chọn màu **Titan Xám** và dung lượng **256GB**, giá khuyến mãi hiển thị là **32.990.000₫**, tiết kiệm 2 triệu so với giá gốc. Hệ thống cũng hiển thị các thông tin quan trọng như bảo hành 12 tháng, trợ giá thu cũ lên đến 2 triệu và ưu đãi dành cho hội viên D.Member."
>
> "Bên dưới là phần đánh giá sản phẩm với điểm trung bình 4.8/5 từ hơn 1256 lượt đánh giá — dữ liệu được cập nhật real-time từ collection reviews."
>
> "Tôi sẽ thêm sản phẩm này vào giỏ hàng."

---

### ⏱ Phân đoạn 4: 3:30 – 4:30 | Đăng nhập, Giỏ hàng & Áp dụng Voucher

#### Giao diện hiển thị (Visual)

**Bước 1 — Form đăng nhập** (`/login`):
- Ô nhập Email, Password
- Nút "Đăng nhập"
- Link "Đăng ký tài khoản" và "Quên mật khẩu"
- Nút "Đăng nhập với Google" (Google OAuth)

**Bước 2 — Trang giỏ hàng** (`/cart`):
- Danh sách item: iPhone 16 Pro Max (Titan Xám, 8GB/256GB), đơn giá 32.990.000₫, số lượng 1, nút tăng/giảm/xóa
- Ô nhập mã giảm giá + nút "Áp dụng"
- Tổng tiền tạm tính: 32.990.000₫
- Dòng giảm giá: -200.000₫ (mã WELCOME10)
- Tổng cộng: **32.790.000₫**
- Nút "**Thanh toán ngay**"

**Thông tin thêm**: Mỗi item hiển thị tồn kho thực tế (`stock`) lấy từ Inventory, nếu hết hàng thì disabled

#### Hành động demo (Action)
1. Click icon Tài khoản (header) → chọn "Đăng nhập"
2. Nhập `nguyenvana@email.com` / `User@123` → click "Đăng nhập"
3. Click icon giỏ hàng → vào trang `/cart`
4. Nhập mã `WELCOME10` vào ô voucher → click "Áp dụng"
5. Quan sát dòng giảm giá hiển thị -200.000₫
6. Click "Thanh toán ngay"

#### Lời thoại (Voice-over)
> "Để tiến hành đặt hàng, tôi cần đăng nhập vào hệ thống. Hệ thống sử dụng **JWT (JSON Web Token)** để xác thực — access token có thời hạn 7 ngày, refresh token 30 ngày."
>
> "Tài khoản đã được tạo sẵn qua script **seed data**. Sau khi đăng nhập thành công, tôi vào giỏ hàng — tại đây hiển thị sản phẩm tôi vừa thêm, kèm thông tin chi tiết về màu sắc, dung lượng và giá tại thời điểm thêm."
>
> "Tôi áp dụng mã **WELCOME10** — mã giảm 10% cho khách hàng mới, tối đa 200.000₫. Hệ thống tự động kiểm tra điều kiện áp dụng: mã còn hiệu lực, chưa hết lượt, giá trị đơn hàng đáp ứng yêu cầu tối thiểu. Sau đó tính toán số tiền giảm và cập nhật tổng tiền ngay lập tức — **32.790.000₫**."

---

### ⏱ Phân đoạn 5: 4:30 – 5:30 | Đặt hàng & Thanh toán

#### Giao diện hiển thị (Visual)
Trang thanh toán **Checkout** (`/checkout`):

- **Thông tin giao hàng** (tự động điền địa chỉ mặc định của user):
  - Họ tên: Nguyễn Văn A
  - Số điện thoại: 0912345678
  - Tỉnh/Thành: Hồ Chí Minh
  - Quận/Huyện: Quận 3
  - Phường/Xã: Phường 4
  - Địa chỉ: 123 Lê Văn Sỹ
- **Chọn chi nhánh nhận hàng** (Dropdown):
  - Di Động Việt — Quận 1 (đang chọn)
  - Di Động Việt — Quận 3
  - Di Động Việt — Hà Nội
  - Di Động Việt — Đà Nẵng
  - ...
- **Phương thức thanh toán** (Radio button):
  - 💵 **COD** (Thanh toán khi nhận hàng) — đang chọn
  - 💳 **VNPAY** (Chuyển khoản qua VNPAY)
  - 📱 **MOMO** (Ví điện tử MOMO)
  - 🏦 **Trả góp 0%**
- **Tổng kết đơn hàng** (bên phải):
  - Tạm tính: 32.990.000₫
  - Giảm giá voucher: -200.000₫
  - Phí ship: miễn phí (đơn > 2 triệu)
  - **Tổng cộng: 32.790.000₫**
- Nút "**Đặt hàng**" (màu đỏ, nổi bật)

#### Hành động demo (Action)
1. Chọn chi nhánh: **"Di Động Việt — Quận 1"**
2. Chọn phương thức thanh toán: **"COD"**
3. Kiểm tra tổng tiền cuối cùng
4. Click nút **"Đặt hàng"**
5. Quan sát thông báo "Đặt hàng thành công!" + mã đơn hàng
6. Vào email (nếu có) → thấy email xác nhận đơn hàng tự động

#### Lời thoại (Voice-over)
> "Tại trang thanh toán, thông tin giao hàng được **tự động điền** từ địa chỉ mặc định của tài khoản — tính năng này lấy từ địa chỉ có flag `isDefault=true` trong collection accounts."
>
> "Một điểm đặc biệt của hệ thống là khách hàng có thể **chọn nhận hàng tại chi nhánh mong muốn**. Tôi chọn **Di Động Việt — Quận 1**. Khi đặt hàng, hệ thống sẽ trừ tồn kho của đúng chi nhánh đó thông qua collection **Inventory**."
>
> "Hệ thống hỗ trợ đa dạng phương thức thanh toán: **COD, VNPAY, MOMO và Trả góp 0%**. Tôi chọn thanh toán khi nhận hàng."
>
> "Sau khi nhấn 'Đặt hàng', hệ thống xử lý giao dịch trong một **MongoDB Transaction** — bao gồm: trừ tồn kho Inventory, tạo đơn hàng trong Orders, xóa sản phẩm khỏi giỏ hàng, tăng usedCount của voucher. Nếu bất kỳ bước nào thất bại, **toàn bộ giao dịch sẽ rollback** — đảm bảo tính toàn vẹn dữ liệu tuyệt đối."

---

### ⏱ Phân đoạn 6: 5:30 – 7:00 | Dashboard Admin & Quản lý đơn hàng

#### Giao diện hiển thị (Visual)

**Bước 1 — Đăng nhập Admin:**
- Đăng xuất tài khoản user
- Đăng nhập với `admin@didongviet.vn` / `Admin@123`

**Bước 2 — Dashboard** (`/admin`):
- **AdminLayout**: Header top bar + Sidebar (có thể thu gọn) với các mục:
  - 📊 Dashboard
  - 📦 Quản lý sản phẩm
  - 🏷️ Quản lý danh mục
  - 📋 Quản lý đơn hàng
  - 👥 Quản lý người dùng
  - 🏪 Chi nhánh & Tồn kho
  - 🎫 Voucher & Flash Sale
  - 📝 Blog & Đánh giá
- **Nội dung Dashboard**:
  - **4 KPI Cards**: Đơn hàng hôm nay, Doanh thu real-time, Tỷ lệ hủy, Hiệu suất Voucher
  - **2 biểu đồ Pie** (Recharts): Tỷ lệ đơn hàng theo kênh, Trạng thái kho tổng
  - **Realtime Feed**: Log hoạt động (đơn hàng mới, cảnh báo tồn kho, voucher)
  - **Top sản phẩm bán chạy** (dạng bảng xếp hạng)

**Bước 3 — Quản lý đơn hàng** (`/admin/orders`):
- **DataTable**: Danh sách đơn hàng (Mã đơn, Khách hàng, Chi nhánh, Tổng tiền, Trạng thái, Ngày tạo)
- Có filter theo trạng thái, tìm kiếm theo SĐT/mã đơn
- Click vào một đơn hàng → xem chi tiết

#### Hành động demo (Action)
1. Click icon Tài khoản → "Đăng xuất"
2. Đăng nhập admin: `admin@didongviet.vn` / `Admin@123`
3. Di chuột qua các KPI cards → số liệu thay đổi
4. Click vào biểu đồ Pie → xem tooltip chi tiết
5. Click sidebar "Quản lý đơn hàng"
6. Tìm đơn hàng vừa tạo (có thể search SĐT: 0912345678)
7. Click vào đơn hàng → xem chi tiết

#### Lời thoại (Voice-over)
> "Bây giờ chúng ta sẽ chuyển sang **giao diện quản trị**. Tôi đăng nhập bằng tài khoản Admin đã được seed."
>
> "**Dashboard tổng quan** hiển thị các chỉ số vận hành quan trọng: số đơn hàng mới hôm nay, doanh thu real-time, tỷ lệ hủy đơn và hiệu suất voucher. Dữ liệu được **polling mỗi 10 giây** để luôn cập nhật — đảm bảo người quản lý luôn có cái nhìn chính xác về tình hình kinh doanh."
>
> "Bên cạnh đó là các **biểu đồ trực quan** sử dụng thư viện Recharts — giúp phân tích tỷ lệ đơn hàng và trạng thái kho một cách trực quan."
>
> "Vào mục **Quản lý đơn hàng**, tôi thấy đơn hàng khách vừa đặt hiển thị ở đây với trạng thái **'Chờ xác nhận'**. Hệ thống hỗ trợ tìm kiếm đơn hàng theo số điện thoại hoặc mã đơn — rất tiện lợi cho việc tra cứu nhanh."

---

### ⏱ Phân đoạn 7: 7:00 – 8:00 | Xử lý đơn hàng (State Machine) & Quản lý kho theo chi nhánh

#### Giao diện hiển thị (Visual)

**Bước 1 — Chi tiết đơn hàng:**
- Thông tin người đặt: Nguyễn Văn A, 0912345678
- Sản phẩm: iPhone 16 Pro Max (Titan Xám, 256GB) x1
- Chi nhánh: Di Động Việt — Quận 1
- Phương thức: COD
- Tổng tiền: 32.790.000₫
- Trạng thái hiện tại: **Chờ xác nhận**
- Nút chuyển trạng thái: [Xác nhận] [Hủy đơn]

**Bước 2 — Chuyển trạng thái qua 4 bước:**
1. Click "Xác nhận" → Trạng thái: **Chờ lấy hàng**
2. Click "Giao hàng" → Trạng thái: **Đang giao** + hiển thị mã vận đơn GHN
3. Click "Đã giao" → Trạng thái: **Đã giao** + isPaid=true (COD)

**Bước 3 — Quản lý kho** (`/admin/inventory`):
- Chọn sản phẩm: iPhone 16 Pro Max
- Chọn chi nhánh: Quận 1
- Bảng variants với cột: Màu sắc, Dung lượng, SKU, Số lượng tồn
- Thấy số lượng Titan Xám 256GB đã giảm từ 50 → 49
- Nút "Chỉnh sửa" để cập nhật số lượng

#### Hành động demo (Action)
1. Click "Xác nhận" → quan sát trạng thái chuyển "Chờ lấy hàng"
2. Click "Giao hàng" → quan sát trạng thái "Đang giao" + mã GHN xuất hiện
3. Click "Đã giao" → trạng thái "Đã giao"
4. Vào sidebar "Chi nhánh & Tồn kho"
5. Chọn "iPhone 16 Pro Max", chi nhánh "Quận 1"
6. Thấy số lượng Titan Xám 256GB = 49 (đã giảm 1)
7. Chỉnh sửa số lượng thành 50 → click Lưu

#### Lời thoại (Voice-over)
> "Admin tiến hành xử lý đơn hàng. Hệ thống áp dụng **State Machine** với 4 trạng thái: **Chờ xác nhận → Chờ lấy hàng → Đang giao → Đã giao**. Mỗi bước chỉ có thể chuyển tiếp theo đúng luồng — nếu cố tình chuyển sai, hệ thống sẽ báo lỗi ngay lập tức."
>
> "Khi tôi chuyển sang trạng thái **'Đang giao'**, hệ thống tự động gọi API **Giao Hàng Nhanh (GHN)** để tạo vận đơn — mã vận đơn được lưu vào trường `ghnOrderCode`. Nếu GHN tạm thời lỗi, hệ thống vẫn chuyển trạng thái và ghi log để xử lý sau."
>
> "Tiếp theo, tôi vào mục **Quản lý kho**. Điểm mấu chốt của hệ thống là **tồn kho được quản lý tách biệt theo từng chi nhánh** thông qua collection Inventory. Tôi thấy số lượng iPhone 16 Pro Max Titan Xám 256GB tại chi nhánh Quận 1 đã giảm từ 50 xuống 49 — đúng với số lượng vừa bán. Các chi nhánh khác hoàn toàn không bị ảnh hưởng."

---

### ⏱ Phân đoạn 8: 8:00 – 9:30 | Tính năng đặc biệt: Bảo mật, Chặn hết hàng, Hủy đơn + hoàn kho

#### Giao diện hiển thị (Visual)

**Demo 1 — Chặn đặt hàng khi hết hàng:**
- Admin vào Inventory → set stock = 0 cho variant Titan Xám 256GB
- Mở một tab ẩn danh → truy cập trang chi tiết iPhone 16 Pro Max
- Quan sát: Nút "Thêm vào giỏ hàng" chuyển thành **"Hết hàng"** (disabled + màu xám)
- Dùng Postman gửi POST `/api/v1/orders` với variant này → nhận response 400 + message lỗi

**Demo 2 — Phân quyền RBAC:**
- Mở Postman/Insomnia
- Gửi GET `http://localhost:5000/api/v1/analytics/dashboard-overview`
- Header: `Authorization: Bearer <token_user>`
- Response: `{"success": false, "message": "Quyền truy cập bị từ chối: Chỉ dành cho Admin"}` — status 403

**Demo 3 — Hủy đơn + hoàn kho:**
- Vào chi tiết đơn hàng đang "Chờ xác nhận"
- Click "Hủy đơn"
- Quan sát trạng thái chuyển "Đã hủy"
- Vào Inventory → thấy số lượng Titan Xám 256GB được cộng lại từ 49 → 50

#### Hành động demo (Action)
1. **Demo 1**: Set stock=0 → Mở tab ẩn danh → refresh trang SP → chụp màn hình "Hết hàng"
2. **Demo 2**: Mở Postman → gõ request → show response 403
3. **Demo 3**: Vào đơn hàng → click "Hủy" → vào Inventory → kiểm tra stock đã hoàn

#### Lời thoại (Voice-over)
> "Xin phép quý Thầy Cô, tôi xin demo một số tính năng nâng cao thể hiện tính **bảo mật và ràng buộc logic** của hệ thống."
>
> "**Thứ nhất — Chặn đặt hàng khi hết hàng:** Khi tôi set tồn kho của variant về 0, giao diện người dùng tự động chuyển nút thành **'Hết hàng'** — ngăn chặn hoàn toàn việc tạo đơn hàng lỗi. Nếu cố tình gọi API đặt hàng, hệ thống sử dụng **MongoDB Transaction** để rollback toàn bộ giao dịch và báo lỗi."
>
> "**Thứ hai — Phân quyền RBAC 3 cấp:** Hệ thống phân làm 3 cấp — **user, staff và admin**. Mỗi cấp chỉ có thể truy cập các API tương ứng. Tôi dùng Postman để gọi API dashboard bằng token user thường và nhận về lỗi **403 Forbidden** với message 'Quyền truy cập bị từ chối: Chỉ dành cho Admin'."
>
> "**Thứ ba — Hủy đơn và hoàn kho:** Khi admin hủy đơn hàng ở trạng thái 'Chờ xác nhận', hệ thống tự động **hoàn lại tồn kho** cho chi nhánh tương ứng và giảm `usedCount` của voucher — đảm bảo tính toàn vẹn dữ liệu tuyệt đối."

---

### ⏱ Phân đoạn 9: 9:30 – 10:00 | Tổng kết & Cảm ơn Hội đồng

#### Giao diện hiển thị (Visual)

**Bước 1 — Kiểm tra API hoạt động:**
- Mở Terminal (Command Prompt)
- Chạy lệnh `curl http://localhost:5000`
- Hiển thị: **"API Di Động Việt đang hoạt động ổn định..."**

**Bước 2 — Slide tổng kết (có thể chuyển sang PowerPoint hoặc trang tĩnh):**
- Logo Di Động Việt
- Danh sách công nghệ đã sử dụng (dạng tag cloud):
  - **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Shadcn/ui, Zustand, Recharts
  - **Backend**: Node.js, Express.js 5, MongoDB, Mongoose, JWT, Nodemailer
  - **Tích hợp**: VNPAY, MOMO, GHN, Google OAuth, Google Gemini AI
- Dòng chữ: **"Xin chân thành cảm ơn quý Thầy Cô!"**

#### Hành động demo (Action)
1. Mở terminal → gõ `curl http://localhost:5000` → Enter
2. Chuyển sang slide tổng kết (hoặc mở file ảnh/PDF)
3. Giơ tay chào kết thúc

#### Lời thoại (Voice-over)
> "Cuối cùng, tôi xin kiểm tra trạng thái hoạt động của hệ thống qua lệnh `curl http://localhost:5000` — server Backend đang hoạt động ổn định."
>
> "**Tóm lại**, hệ thống quản lý và bán hàng trực tuyến cho chuỗi cửa hàng Di Động Việt đã được xây dựng hoàn chỉnh với:"
>
> "- **Frontend**: Next.js 16 App Router với TypeScript, Tailwind CSS 4 và Shadcn/ui — giao diện hiện đại, responsive, tối ưu SEO"
> "- **Backend**: Express.js 5 với MongoDB và Mongoose — 15 collections, 16 domain modules, Route Registry Pattern"
> "- **Bảo mật**: JWT Authentication, RBAC 3 cấp (user/staff/admin), validate dữ liệu đầu vào"
> "- **Tích hợp**: Thanh toán VNPAY và MOMO, vận chuyển GHN, Google OAuth, Chatbot AI Gemini"
> "- **Đặc biệt**: MongoDB Transaction cho đặt hàng, State Machine cho đơn hàng, quản lý tồn kho đa chi nhánh"
>
> "Em xin chân thành cảm ơn quý Thầy Cô đã lắng nghe và rất mong nhận được những đóng góp quý báu để hoàn thiện đồ án tốt nghiệp này. **Em xin cảm ơn!**"

---

## 📊 Tổng quan kỹ thuật

### Các công nghệ được demo trong video

| Công nghệ | Vị trí xuất hiện | Mô tả |
|-----------|------------------|-------|
| **Next.js 16 App Router** | Toàn bộ video | Route Groups: `(shop)/`, `(auth)/`, `admin/` |
| **Server/Client Components** | Phân đoạn 1-5 | `'use client'` cho interactive components |
| **Zustand** | Phân đoạn 4 | Quản lý state giỏ hàng (`useCartStore`) |
| **Shadcn/ui** | Phân đoạn 1-7 | Button, Card, Dialog, Table, Input |
| **Recharts** | Phân đoạn 6 | Biểu đồ Pie, Bar chart trong Dashboard |
| **Tailwind CSS 4** | Toàn bộ video | Giao diện responsive, utility classes |
| **Express.js 5** | Phân đoạn 1, 9 | RESTful API, Error handling middleware |
| **MongoDB Transactions** | Phân đoạn 5, 8 | Rollback khi đặt hàng lỗi |
| **JWT Authentication** | Phân đoạn 4, 6 | Access Token + Refresh Token |
| **RBAC** | Phân đoạn 8 | 3 cấp: user / staff / admin |
| **GHN API** | Phân đoạn 7 | Tạo vận đơn tự động |
| **MOMO / VNPAY** | Phân đoạn 5 | Cổng thanh toán điện tử |
| **Nodemailer** | Phân đoạn 5 | Gửi email OTP, xác nhận đơn hàng |
| **Multer + Sharp** | Phân đoạn 3 | Upload & xử lý ảnh sản phẩm |
| **Mongoose ODM** | Phân đoạn 2, 3 | Virtual populate, Pre-save hooks, Slugify |

### Các API endpoints được gọi trong video

| Phân đoạn | Endpoint | Mục đích |
|-----------|----------|----------|
| 1,2 | `GET /api/v1/categories` | Lấy danh mục cho menu |
| 2 | `GET /api/v1/products/category/:id?brand=Apple` | Lọc sản phẩm |
| 3 | `GET /api/v1/products/iphone-16-pro-max` | Chi tiết sản phẩm |
| 4 | `POST /api/v1/auth/login` | Đăng nhập |
| 4 | `POST /api/v1/cart` | Thêm vào giỏ |
| 4 | `POST /api/v1/cart/apply-voucher` | Áp dụng voucher |
| 5 | `POST /api/v1/orders` | Đặt hàng (Transaction) |
| 6 | `GET /api/v1/analytics/dashboard-overview` | Dashboard Admin |
| 6 | `GET /api/v1/orders` | Danh sách đơn hàng |
| 7 | `PUT /api/v1/orders/:id/status` | Chuyển trạng thái |
| 7 | `GET /api/v1/inventory?product=X&branch=Y` | Xem tồn kho theo chi nhánh |
| 8 | `PUT /api/v1/orders/:id/cancel` | Hủy đơn + hoàn kho |
| 8 | `GET /api/v1/analytics/...` (với token user) | Kiểm tra phân quyền → 403 |

---

## 💡 Lưu ý khi quay video

### Chuẩn bị trước khi quay

1. **Khởi động hệ thống**:
   ```bash
   # Terminal 1 — Backend
   cd be_didongviet_expressjs
   npm run dev
   
   # Terminal 2 — Frontend
   cd fe_didongviet_nextjs
   npm run dev
   ```

2. **Chạy seed data** (nếu chưa có):
   ```bash
   cd be_didongviet_expressjs
   npm run seed
   ```

3. **Cấu hình .env** đảm bảo các biến:
   - `ACCESS_TOKEN_SECRET` đã được tạo
   - `MONGODB_CONNECTION_STRING` đã đúng
   - Các cổng 5000 và 3000 không bị conflict

### Kỹ thuật quay

- **Mỗi phân đoạn quay riêng** → dễ chỉnh sửa sau
- **Tắt thông báo hệ thống** (Windows notifications, Slack, Messenger)
- **Đặt trình duyệt ở chế độ Fullscreen** (F11)
- **Zoom trình duyệt ở mức 100%** để chữ không bị vỡ
- **Sử dụng cursor highlight** nếu có (ZoomIt, PointerFocus)

### Hậu kỳ

- Có thể chèn **hiệu ứng chuyển cảnh** giữa các phân đoạn
- Thêm **Subtitle** cho lời thoại (dùng CapCut, Premiere Pro)
- Chèn **logo Di Động Việt** ở góc màn hình
- Âm nhạc nền: nhạc không lời, âm lượng 20-30%

---

> 🎬 **Chúc bạn quay video thành công!**