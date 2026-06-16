// Client-side API helpers (không phải server action)
// Dùng fetch trực tiếp đến BFF routes (/api/student-profile/...)
// để browser tự động gửi cookie kèm token

const API_BASE = '/api/student-profile';

export async function fetchStudentProfile() {
    try {
        const res = await fetch(`${API_BASE}/me`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('fetchStudentProfile error:', error);
        return { success: false, message: 'Mất kết nối tới hệ thống.' };
    }
}

export async function uploadStudentCardFetch(formData: FormData) {
    try {
        const res = await fetch(`${API_BASE}/upload-card`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('uploadStudentCardFetch error:', error);
        return { success: false, message: 'Mất kết nối tới hệ thống.' };
    }
}

export async function updateStudentProfileFetch(bodyData: {
    studentIdCard?: string;
    schoolName?: string;
    studentCardImage?: string;
}) {
    try {
        const res = await fetch(`${API_BASE}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('updateStudentProfileFetch error:', error);
        return { success: false, message: 'Mất kết nối tới hệ thống.' };
    }
}