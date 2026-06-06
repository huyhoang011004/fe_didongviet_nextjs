import { useState, useEffect } from 'react';
import {
  fetchCategoryInfo,
  fetchCategoryProducts,
  fetchAllProductsForBrands,
} from './category-actions';

// Dữ liệu SEO bài viết và FAQ tĩnh cho các danh mục lớn
export const categorySeoData: Record<string, {
  seoTitle: string;
  toc: string[];
  content: string;
  faqs: { q: string; a: string }[];
}> = {
  'dien-thoai': {
    seoTitle: 'Điện Thoại Di Động Thông Minh, Smartphone Chính Hãng, Giá Tốt',
    toc: [
      'Thông tin chung và điện thoại di động',
      'Các phân khúc điện thoại di động phổ biến hiện nay',
      'Các thương hiệu điện thoại nổi tiếng hàng đầu',
      'Kinh nghiệm chọn mua điện thoại chất lượng, phù hợp',
      'Tại sao nên chọn mua điện thoại chính hãng tại Di Động Việt?'
    ],
    content: `
      <h3>Thông tin chung và điện thoại di động</h3>
      <p>Trong thời đại điện tử hiện nay, điện thoại di động đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày của con người. Từ những thiết bị đơn sơ chỉ có chức năng nghe gọi cơ bản, các dòng điện thoại di động thông minh (smartphone) ngày nay đã được trang bị màn hình cảm ứng sắc nét, bộ vi xử lý cực mạnh, và hệ thống camera chuyên nghiệp không thua kém gì máy ảnh chuyên dụng.</p>
      
      <h3>Các phân khúc điện thoại di động phổ biến hiện nay</h3>
      <p>Thị trường smartphone được chia thành nhiều phân khúc đa dạng để đáp ứng mọi túi tiền và nhu cầu của người dùng:</p>
      <ul>
        <li><strong>Phân khúc giá rẻ (Dưới 4 triệu):</strong> Phù hợp với học sinh, sinh viên hoặc người lớn tuổi chỉ có nhu cầu cơ bản như liên lạc, đọc báo, lướt web và xem video. Các đại diện nổi bật gồm Xiaomi Redmi Series, realme C Series.</li>
        <li><strong>Phân khúc tầm trung (4 - 10 triệu):</strong> Phân khúc sôi động nhất với cấu hình mạnh mẽ, camera sắc nét và dung lượng pin khủng. Các dòng sản phẩm bán chạy gồm Samsung Galaxy A Series, OPPO A/Reno Series.</li>
        <li><strong>Phân khúc cao cấp và Flagship (Trên 10 triệu):</strong> Hội tụ những công nghệ đỉnh cao nhất về màn hình OLED, hiệu năng chip xử lý mạnh mẽ nhất thế giới và camera zoom quang học xa. Nổi tiếng nhất là iPhone Series của Apple và Galaxy S/Z Series của Samsung.</li>
      </ul>

      <h3>Các thương hiệu điện thoại nổi tiếng hàng đầu</h3>
      <p>Di Động Việt tự hào là đối tác liên kết cao cấp của các thương hiệu hàng đầu thế giới:</p>
      <ul>
        <li><strong>Apple (iPhone):</strong> Thiết kế sang trọng, hệ điều hành iOS tối ưu mượt mà và camera chân thực bậc nhất. Dòng iPhone 16 Pro Max đang là tâm điểm chú ý của thị trường.</li>
        <li><strong>Samsung:</strong> Gã khổng lồ công nghệ dẫn đầu xu hướng màn hình gập độc đáo (Galaxy Z Fold/Flip) và chụp ảnh siêu zoom trên các dòng Galaxy S Ultra.</li>
        <li><strong>Xiaomi & realme:</strong> Mức giá cực tốt so với cấu hình phần cứng mang lại, dung lượng pin bền bỉ và tốc độ sạc siêu nhanh.</li>
      </ul>
      
      <h3>Tại sao nên chọn mua điện thoại chính hãng tại Di Động Việt?</h3>
      <p>Di Động Việt mang đến cho khách hàng trải nghiệm mua sắm tuyệt vời với triết lý <strong>"Rẻ hơn các loại rẻ - Chuyển giao giá trị vượt trội"</strong>:</p>
      <ol>
        <li>Sản phẩm cam kết chính hãng 100%, bảo hành chính thức từ hãng.</li>
        <li>Hỗ trợ Thu cũ đổi mới lên đời trợ giá cực cao.</li>
        <li>Trả góp 0% lãi suất qua thẻ tín dụng và các công ty tài chính.</li>
        <li>Độc quyền thành viên D.Member giảm thêm 1% trên mọi đơn hàng.</li>
      </ol>
    `,
    faqs: [
      {
        q: 'Di Động Việt có hỗ trợ trả góp điện thoại không?',
        a: 'Có! Di Động Việt hỗ trợ trả góp 0% lãi suất thông qua hơn 20 ngân hàng đối tác bằng thẻ tín dụng hoặc thông qua các công ty tài chính phổ biến (Home Credit, FE Credit, HD Saison) với thủ tục duyệt hồ sơ cực nhanh chỉ trong 15-30 phút.'
      },
      {
        q: 'Điện thoại tại Di Động Việt có được bảo hành chính hãng không?',
        a: 'Tất cả điện thoại bán ra tại Di Động Việt đều là hàng chính hãng 100%, được kích hoạt bảo hành điện tử chính thức từ nhà sản xuất. Khách hàng có thể mang máy bảo hành trực tiếp tại bất kỳ trung tâm bảo hành ủy quyền nào của Apple, Samsung, Xiaomi, OPPO... trên toàn quốc.'
      },
      {
        q: 'Chương trình Thu cũ đổi mới (Trade-in) lên đời điện thoại hoạt động ra sao?',
        a: 'Bạn chỉ cần mang chiếc điện thoại cũ của mình đến cửa hàng Di Động Việt gần nhất. Nhân viên kỹ thuật sẽ định giá máy cũ dựa trên tình trạng thực tế của máy. Mức định giá này cộng thêm khoản trợ giá độc quyền từ Di Động Việt (lên đến vài triệu đồng) sẽ được trừ trực tiếp vào giá bán của máy mới bạn muốn lên đời.'
      }
    ]
  },
  'laptop': {
    seoTitle: 'MacBook & Laptop Chính Hãng, Cấu Hình Mạnh, Giá Rẻ Hơn Các Loại Rẻ',
    toc: [
      'Thông tin chung về dòng máy Laptop và MacBook',
      'Các thương hiệu máy tính nổi tiếng bán chạy tại Di Động Việt',
      'Kinh nghiệm chọn cấu hình laptop phù hợp với nhu cầu',
      'Chính sách bảo hành và ưu đãi khi mua laptop tại Di Động Việt'
    ],
    content: `
      <h3>Thông tin chung về dòng máy Laptop và MacBook</h3>
      <p>Laptop và MacBook ngày nay đã trở thành công cụ làm việc, học tập không thể thiếu cho mọi người, từ học sinh, sinh viên cho đến dân văn phòng, lập trình viên, designer chuyên nghiệp. Sở hữu một chiếc laptop mỏng nhẹ, pin khỏe sẽ giúp bạn giải quyết công việc mọi lúc mọi nơi một cách hiệu quả.</p>
      
      <h3>Các thương hiệu máy tính nổi tiếng bán chạy tại Di Động Việt</h3>
      <ul>
        <li><strong>Apple (MacBook):</strong> Nổi bật với MacBook Air và MacBook Pro chạy chip Apple Silicon (M1, M2, M3). Thiết kế nhôm nguyên khối siêu sang trọng, thời lượng pin lên đến 18-20 tiếng và màn hình Retina siêu sắc nét.</li>
        <li><strong>Asus & Acer:</strong> Dẫn đầu trong phân khúc laptop văn phòng tầm trung và laptop gaming giá rẻ cấu hình cao với các dòng VivoBook, ZenBook, Nitro 5, Aspire.</li>
        <li><strong>HP & Dell:</strong> Thương hiệu của sự bền bỉ, tính bảo mật cao và bàn phím gõ êm ái. Các dòng HP Pavilion, Dell Inspiron là sự lựa chọn tối ưu cho doanh nghiệp và văn phòng.</li>
      </ul>
      
      <h3>Kinh nghiệm chọn cấu hình laptop phù hợp với nhu cầu</h3>
      <p>Để tối ưu chi phí, bạn nên lựa chọn cấu hình máy dựa trên mục đích sử dụng thực tế:</p>
      <ul>
        <li><strong>Học tập - Văn phòng cơ bản:</strong> Nên chọn CPU Intel Core i3/i5 hoặc AMD Ryzen 3/5, RAM tối thiểu 8GB, SSD 256GB. Thiết kế mỏng nhẹ dễ di chuyển.</li>
        <li><strong>Đồ họa - Lập trình chuyên nghiệp:</strong> Cần màn hình chuẩn màu (100% sRGB hoặc Retina), RAM 16GB trở lên, CPU Core i7/Ryzen 7 và ổ cứng SSD 512GB tốc độ cao.</li>
        <li><strong>Gaming - Thiết kế 3D:</strong> Bắt buộc phải có card đồ họa rời (NVIDIA GeForce RTX), màn hình tần số quét cao (120Hz/144Hz) và hệ thống tản nhiệt tối ưu.</li>
      </ul>
    `,
    faqs: [
      {
        q: 'Mua MacBook tại Di Động Việt có được bảo hành chính hãng Apple không?',
        a: 'Có! Di Động Việt là đại lý ủy quyền chính thức của Apple (AAR) tại Việt Nam. Toàn bộ máy MacBook bán ra đều được bảo hành chính hãng 12 tháng tại các trung tâm bảo hành ủy quyền của Apple Việt Nam (như Thakral One, Điện Thoại Vui, CareS...).'
      },
      {
        q: 'Di Động Việt có cài đặt hệ điều hành và phần mềm miễn phí khi mua laptop không?',
        a: 'Khách hàng mua laptop tại Di Động Việt sẽ được hỗ trợ cài đặt hệ điều hành Windows bản quyền (theo máy), các phần mềm văn phòng cơ bản hoàn toàn miễn phí và nhận gói hỗ trợ kỹ thuật trọn đời máy.'
      }
    ]
  },
  'ipad-tablet': {
    seoTitle: 'Máy Tính Bảng iPad & Tablet Chính Hãng, Giá Siêu Tốt, Trả Góp 0%',
    toc: [
      'Xu hướng sử dụng máy tính bảng (Tablet) hiện nay',
      'Phân loại iPad & Tablet phổ biến trên thị trường',
      'Ưu đãi đặc quyền khi mua máy tính bảng tại Di Động Việt'
    ],
    content: `
      <h3>Xu hướng sử dụng máy tính bảng (Tablet) hiện nay</h3>
      <p>Máy tính bảng (Tablet) là sự giao thoa hoàn hảo giữa smartphone và laptop. Với màn hình lớn từ 10 inch đến 13 inch, tablet mang đến không gian hiển thị rộng rãi cho việc đọc tài liệu, xem phim, vẽ tranh nghệ thuật và xử lý nhanh các tác vụ công việc văn phòng mà vẫn đảm bảo tính di động vượt trội.</p>
      
      <h3>Phân loại iPad & Tablet phổ biến trên thị trường</h3>
      <ul>
        <li><strong>Apple iPad:</strong> Dòng máy tính bảng thống trị thị trường với iPad Gen giá rẻ cho học tập, iPad Air mỏng nhẹ cấu hình mạnh, và iPad Pro chip M4 siêu khủng cho công việc sáng tạo đồ họa chuyên nghiệp.</li>
        <li><strong>Samsung Galaxy Tab:</strong> Đại diện lớn nhất của hệ điều hành Android, nổi bật nhờ tích hợp sẵn bút S-Pen thông minh trong hộp máy, hỗ trợ viết vẽ ghi chú cực tốt và chế độ Samsung DeX biến tablet thành máy tính.</li>
        <li><strong>Xiaomi Pad:</strong> Lựa chọn cấu hình mạnh mẽ, màn hình 120Hz mượt mà cùng tầm giá cực kỳ dễ tiếp cận dành cho giải trí, chơi game.</li>
      </ul>
    `,
    faqs: [
      {
        q: 'Có nên mua bút cảm ứng và bàn phím đi kèm máy tính bảng không?',
        a: 'Nếu bạn sử dụng tablet để ghi chép bài học, vẽ tranh đồ họa hoặc gõ văn bản làm việc văn phòng, thì bút cảm ứng (Apple Pencil, S-Pen) và bàn phím không dây là những phụ kiện đắc lực giúp tối ưu hóa công suất làm việc của máy.'
      }
    ]
  }
};

export function useCategory(slug: string) {
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Bộ lọc và phân trang
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Đóng/Mở SEO bài viết và FAQ
  const [showFullSeo, setShowFullSeo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const limitPerPage = 10;

  // Lấy metadata danh mục & danh sách thương hiệu
  useEffect(() => {
    if (!slug) return;

    async function fetchCategoryInfoData() {
      const catRes = await fetchCategoryInfo(slug);
      if (catRes && catRes.success) {
        setCategory(catRes.data);
      } else {
        const catName = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setCategory({
          name: catName,
          slug: slug,
          description: `Khám phá các dòng sản phẩm ${catName} chính hãng chất lượng cao.`,
        });
      }

      const allProdsRes = await fetchAllProductsForBrands(slug);
      if (allProdsRes && allProdsRes.success) {
        const prods = allProdsRes.products || allProdsRes.data || [];
        const distinctBrands: string[] = Array.from(
          new Set(prods.map((p: any) => p.brand).filter(Boolean)),
        );
        setAvailableBrands(distinctBrands);
      }
    }

    fetchCategoryInfoData();
  }, [slug]);

  // Load danh sách sản phẩm khi có filter/sort/pagination thay đổi
  useEffect(() => {
    if (!slug) return;

    async function loadProductsData() {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetchCategoryProducts(
        slug,
        currentPage,
        limitPerPage,
        brandFilter,
        priceSort
      );

      if (res && res.success) {
        const newProducts = res.products || res.data || [];
        if (currentPage === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || 0);
      } else {
        if (currentPage === 1) {
          setProducts([]);
        }
      }
      setLoading(false);
      setLoadingMore(false);
    }

    loadProductsData();
  }, [slug, brandFilter, priceSort, currentPage]);

  const handleBrandChange = (brand: string) => {
    setBrandFilter(brand);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setPriceSort(sort);
    setCurrentPage(1);
  };

  const loadMoreProducts = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const currentSeo = categorySeoData[slug] || {
    seoTitle: `${category?.name || 'Ngành Hàng'} Chính Hãng, Rẻ Hơn Các Loại Rẻ`,
    toc: [
      `Thông tin chung về ${category?.name || 'sản phẩm'}`,
      `Tại sao nên mua ${category?.name || 'sản phẩm'} chính hãng tại Di Động Việt?`
    ],
    content: `
      <h3>Thông tin chung về ${category?.name || 'sản phẩm'}</h3>
      <p>Các dòng sản phẩm thuộc danh mục ${category?.name || 'sản phẩm'} chính hãng luôn mang lại độ tin cậy tuyệt đối và công nghệ tiên tiến nhất đến cho người dùng. Khám phá các mẫu mã đa dạng, hiệu năng đỉnh cao với mức giá ưu đãi nhất thị trường.</p>
      
      <h3>Tại sao nên mua ${category?.name || 'sản phẩm'} chính hãng tại Di Động Việt?</h3>
      <p>Di Động Việt mang đến cho khách hàng trải nghiệm mua sắm vượt trội với mức giá "Rẻ hơn các loại rẻ", hỗ trợ bảo hành chính hãng đầy đủ, thủ tục mua trả góp 0% nhanh chóng và chính sách Thu cũ đổi mới trợ giá cao nhất.</p>
    `,
    faqs: [
      {
        q: `Mua ${category?.name || 'sản phẩm'} tại Di Động Việt có được bảo hành chính hãng không?`,
        a: `Tất cả các sản phẩm thuộc danh mục ${category?.name || 'ngành hàng'} bán ra tại Di Động Việt đều là hàng chính hãng 100%, có hóa đơn đầy đủ và được bảo hành chính hãng theo đúng quy định của nhà sản xuất.`
      },
      {
        q: 'Di Động Việt có hỗ trợ giao hàng tận nơi không?',
        a: 'Di Động Việt hỗ trợ giao hàng nhanh toàn quốc, miễn phí giao hàng cho thành viên D.Member hoặc đơn hàng đạt giá trị tối thiểu theo quy định. Vui lòng liên hệ hotline 1800.6018 để được hỗ trợ cụ thể.'
      }
    ]
  };

  return {
    category,
    products,
    loading,
    loadingMore,
    brandFilter,
    priceSort,
    currentPage,
    totalPages,
    totalProducts,
    availableBrands,
    showFullSeo,
    setShowFullSeo,
    openFaqIndex,
    setOpenFaqIndex,
    limitPerPage,
    handleBrandChange,
    handleSortChange,
    loadMoreProducts,
    toggleFaq,
    currentSeo,
  };
}
