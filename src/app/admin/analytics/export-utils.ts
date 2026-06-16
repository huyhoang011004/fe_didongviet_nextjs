import * as XLSX from 'xlsx-js-style';

const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

// Lazy load html2pdf.js (chỉ load khi cần, client-side only)
async function getHtml2pdf() {
    if (typeof window === 'undefined') return null;
    const mod = await import('html2pdf.js');
    return mod.default;
}

// ========== STYLE CHO EXCEL ==========
const HEADER_S = {
    font: { bold: true, sz: 11, name: 'Arial', color: { rgb: 'FFFFFF' } },
    border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    },
    fill: { fgColor: { rgb: 'DC2626' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
};

const CELL_S = {
    font: { sz: 10, name: 'Arial' },
    border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    },
};

const TITLE_S = {
    font: { bold: true, sz: 14, name: 'Arial' },
};

const SUBTITLE_S = {
    font: { sz: 10, name: 'Arial', italic: true, color: { rgb: '666666' } },
};

// Helper: Tạo worksheet từ mảng 2D với header styling
function createStyledSheet(headers: string[], rows: any[][], colWidths: { wch: number }[]) {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Áp dụng style cho header row (row 0)
    headers.forEach((_, c) => {
        const ref = XLSX.utils.encode_cell({ r: 0, c });
        if (ws[ref]) ws[ref].s = HEADER_S;
    });

    // Áp dụng style cho data rows
    rows.forEach((_, r) => {
        headers.forEach((_, c) => {
            const ref = XLSX.utils.encode_cell({ r: r + 1, c });
            if (ws[ref]) ws[ref].s = CELL_S;
        });
    });

    ws['!cols'] = colWidths;
    return ws;
}

// ========== XUẤT EXCEL ==========
export function exportAnalyticsToExcel(data: {
    analyticsData: any;
    bestSellingProducts: any[];
    orderStatus: any;
    lowStockProducts: any[];
    oldStockProducts: any[];
    branchRanking: any[];
    chartData?: any[];
    branchName?: string;
    dateRange?: string;
}) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan doanh thu
    const summaryRows = [
        ['Tổng doanh thu', formatVND(data.analyticsData?.totalRevenue || 0)],
        ['Tổng lợi nhuận', formatVND(data.analyticsData?.totalProfit || 0)],
        ['Tổng đơn hàng', String(data.analyticsData?.totalOrders || 0)],
        ['Sản phẩm bán ra', String(data.analyticsData?.totalProductsSold || 0)],
        ['Giá trị đơn hàng TB', formatVND(data.analyticsData?.avgOrderValue || 0)],
    ];
    const wsSummary = createStyledSheet(['Chỉ số', 'Giá trị'], summaryRows, [{ wch: 25 }, { wch: 30 }]);

    // Thêm tiêu đề + subtitle + dòng trống ở đầu sheet
    XLSX.utils.sheet_add_aoa(wsSummary, [
        ['BÁO CÁO DOANH THU & PHÂN TÍCH'],
        [`Chi nhánh: ${data.branchName || 'Tất cả'}    |    Thời gian: ${data.dateRange || 'N/A'}`],
        [], // Dòng trống cách tiêu đề và bảng
    ], { origin: 'A1' });

    // Style cho tiêu đề
    if (wsSummary['A1']) wsSummary['A1'].s = TITLE_S;
    if (wsSummary['A2']) wsSummary['A2'].s = SUBTITLE_S;

    // Shift data rows down by 3 (tiêu đề + subtitle + dòng trống)
    const range = XLSX.utils.decode_range(wsSummary['!ref'] || 'A1');
    range.s.r = 0;
    range.e.r += 3;
    wsSummary['!ref'] = XLSX.utils.encode_range(range);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng quan');

    // Sheet 2: Phân tích theo thời gian (dữ liệu từ biểu đồ)
    if (data.chartData && data.chartData.length > 0) {
        const timeHeaders = ['Thời gian', 'Doanh thu', 'Lợi nhuận', 'Đơn hàng', 'SP bán ra', 'Giá trị ĐH TB'];
        const timeRows = data.chartData.map((point: any) => [
            point.label || '',
            formatVND(point.totalRevenue || 0),
            formatVND(point.totalProfit || 0),
            String(point.totalOrders || 0),
            String(point.totalProductsSold || 0),
            formatVND(point.avgOrderValue || 0),
        ]);
        const wsTime = createStyledSheet(timeHeaders, timeRows, [
            { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
        ]);
        XLSX.utils.book_append_sheet(wb, wsTime, 'Phân tích theo thời gian');
    }

    // Sheet 3: Sản phẩm bán chạy
    if (data.bestSellingProducts.length > 0) {
        const headers = ['STT', 'Sản phẩm', 'Đã bán', 'Doanh thu', 'Lợi nhuận'];
        const rows = data.bestSellingProducts.map((p, i) => [
            String(i + 1),
            p.productName || p.name || '',
            String(p.totalSold || 0),
            formatVND(p.totalRevenue || 0),
            formatVND(p.totalProfit || 0),
        ]);
        const ws = createStyledSheet(headers, rows, [
            { wch: 6 }, { wch: 40 }, { wch: 10 }, { wch: 20 }, { wch: 20 },
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'SP bán chạy');
    }

    // Sheet 4: Trạng thái đơn hàng
    if (data.orderStatus) {
        const os = data.orderStatus;
        const headers = ['Trạng thái', 'Số lượng'];
        const rows = [
            ['Chờ xác nhận', String(os.pending || 0)],
            ['Chờ lấy hàng', String(os.processing || 0)],
            ['Đang giao', String(os.shipping || 0)],
            ['Đã giao', String(os.delivered || 0)],
            ['Đã hủy', String(os.cancelled || 0)],
            ['Trả hàng', String(os.returned || 0)],
        ];
        const ws = createStyledSheet(headers, rows, [{ wch: 20 }, { wch: 12 }]);
        XLSX.utils.book_append_sheet(wb, ws, 'Trạng thái đơn');
    }

    // Sheet 5: Tồn kho thấp
    if (data.lowStockProducts.length > 0) {
        const headers = ['Sản phẩm', 'SKU', 'Tồn kho'];
        const rows = data.lowStockProducts.map((p) => [
            p.productName || p.name || '',
            p.sku || '',
            String(p.stock || 0),
        ]);
        const ws = createStyledSheet(headers, rows, [{ wch: 40 }, { wch: 20 }, { wch: 10 }]);
        XLSX.utils.book_append_sheet(wb, ws, 'Tồn kho thấp');
    }

    // Sheet 6: Xếp hạng chi nhánh
    if (data.branchRanking.length > 0) {
        const headers = ['STT', 'Chi nhánh', 'Doanh thu', 'Đơn hàng', 'SP bán ra'];
        const rows = data.branchRanking.map((b, i) => [
            String(i + 1),
            b.branchName || b.name || '',
            formatVND(b.totalRevenue || 0),
            String(b.totalOrders || 0),
            String(b.totalProductsSold || 0),
        ]);
        const ws = createStyledSheet(headers, rows, [
            { wch: 6 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 12 },
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'Xếp hạng CN');
    }

    const fileName = `BaoCao_DoanhThu_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// ========== XUẤT PDF (dùng html2pdf.js — hỗ trợ tiếng Việt) ==========
export async function exportAnalyticsToPDF(data: {
    analyticsData: any;
    bestSellingProducts: any[];
    orderStatus: any;
    lowStockProducts: any[];
    oldStockProducts: any[];
    branchRanking: any[];
    branchName?: string;
    dateRange?: string;
}) {
    const html2pdf = await getHtml2pdf();
    if (!html2pdf) {
        console.warn('html2pdf.js không khả dụng (server-side)');
        return;
    }

    // Tạo element HTML ẩn để render PDF
    const container = document.createElement('div');
    container.style.cssText = 'font-family: Arial, sans-serif; padding: 30px; color: #1a1a1a; background: #fff; width: 780px;';

    const fmt = (n: number) => formatVND(n);

    container.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 6px 0; color: #111;">BÁO CÁO DOANH THU & PHÂN TÍCH</h1>
        <p style="font-size: 12px; color: #666; margin: 2px 0;">Chi nhánh: ${data.branchName || 'Tất cả'} &nbsp;|&nbsp; Thời gian: ${data.dateRange || 'N/A'} &nbsp;|&nbsp; Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
    </div>

    <!-- Tổng quan -->
    <h2 style="font-size: 15px; font-weight: 700; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 20px;">TỔNG QUAN</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px;">
        <tr style="background: #dc2626; color: #fff;">
            <th style="padding: 8px 12px; border: 1px solid #ccc; text-align: left; font-weight: 700;">Chỉ số</th>
            <th style="padding: 8px 12px; border: 1px solid #ccc; text-align: right; font-weight: 700;">Giá trị</th>
        </tr>
        <tr><td style="padding: 6px 12px; border: 1px solid #ddd;">Tổng doanh thu</td><td style="padding: 6px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600; color: #dc2626;">${fmt(data.analyticsData?.totalRevenue || 0)}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 6px 12px; border: 1px solid #ddd;">Tổng lợi nhuận</td><td style="padding: 6px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600; color: #16a34a;">${fmt(data.analyticsData?.totalProfit || 0)}</td></tr>
        <tr><td style="padding: 6px 12px; border: 1px solid #ddd;">Tổng đơn hàng</td><td style="padding: 6px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">${data.analyticsData?.totalOrders || 0}</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 6px 12px; border: 1px solid #ddd;">Sản phẩm bán ra</td><td style="padding: 6px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">${data.analyticsData?.totalProductsSold || 0}</td></tr>
        <tr><td style="padding: 6px 12px; border: 1px solid #ddd;">Giá trị đơn hàng TB</td><td style="padding: 6px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">${fmt(data.analyticsData?.avgOrderValue || 0)}</td></tr>
    </table>

    <!-- Sản phẩm bán chạy -->
    ${data.bestSellingProducts.length > 0 ? `
    <h2 style="font-size: 15px; font-weight: 700; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 24px;">SẢN PHẨM BÁN CHẠY</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px;">
        <tr style="background: #dc2626; color: #fff;">
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">STT</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: left; font-weight: 700;">Sản phẩm</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">Đã bán</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: right; font-weight: 700;">Doanh thu</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: right; font-weight: 700;">Lợi nhuận</th>
        </tr>
        ${data.bestSellingProducts.map((p, i) => `
        <tr style="background: ${i % 2 === 1 ? '#fafafa' : '#fff'};">
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd;">${p.productName || p.name || ''}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #2563eb;">${p.totalSold || 0}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: right; font-weight: 600; color: #dc2626;">${fmt(p.totalRevenue || 0)}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: right; font-weight: 600; color: #16a34a;">${fmt(p.totalProfit || 0)}</td>
        </tr>`).join('')}
    </table>` : ''}

    <!-- Xếp hạng chi nhánh -->
    ${data.branchRanking.length > 0 ? `
    <h2 style="font-size: 15px; font-weight: 700; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 24px;">XẾP HẠNG CHI NHÁNH</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px;">
        <tr style="background: #dc2626; color: #fff;">
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">STT</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: left; font-weight: 700;">Chi nhánh</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: right; font-weight: 700;">Doanh thu</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">Đơn hàng</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">SP bán ra</th>
        </tr>
        ${data.branchRanking.map((b, i) => `
        <tr style="background: ${i % 2 === 1 ? '#fafafa' : '#fff'};">
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd;">${b.branchName || b.name || ''}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: right; font-weight: 600; color: #dc2626;">${fmt(b.totalRevenue || 0)}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center;">${b.totalOrders || 0}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center;">${b.totalProductsSold || 0}</td>
        </tr>`).join('')}
    </table>` : ''}

    <!-- Tồn kho thấp -->
    ${data.lowStockProducts.length > 0 ? `
    <h2 style="font-size: 15px; font-weight: 700; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 24px;">TỒN KHO THẤP</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px;">
        <tr style="background: #dc2626; color: #fff;">
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: left; font-weight: 700;">Sản phẩm</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: left; font-weight: 700;">SKU</th>
            <th style="padding: 7px 8px; border: 1px solid #ccc; text-align: center; font-weight: 700;">Tồn kho</th>
        </tr>
        ${data.lowStockProducts.map((p, i) => `
        <tr style="background: ${i % 2 === 1 ? '#fafafa' : '#fff'};">
            <td style="padding: 5px 8px; border: 1px solid #ddd;">${p.productName || p.name || ''}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; font-family: monospace;">${p.sku || ''}</td>
            <td style="padding: 5px 8px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #f59e0b;">${p.stock || 0}</td>
        </tr>`).join('')}
    </table>` : ''}
    `;

    // Ẩn container nhưng giữ trong DOM để html2pdf render
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const fileName = `BaoCao_DoanhThu_${new Date().toISOString().slice(0, 10)}.pdf`;

    html2pdf()
        .set({
            margin: [10, 10, 10, 10],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .save()
        .then(() => {
            document.body.removeChild(container);
        })
        .catch(() => {
            document.body.removeChild(container);
        });
}