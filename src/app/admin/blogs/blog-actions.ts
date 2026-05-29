'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getBlogsAction(
  category?: string,
  keyword?: string,
  page: number = 1,
  limit: number = 8,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  blogs: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams({
      showAll: 'true',
      page: page.toString(),
      limit: limit.toString(),
      ...(category ? { category } : {}),
      ...(keyword ? { keyword } : {}),
    });

    const response = await fetch(`${getApiUrl()}/blogs?${query}`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentPage: 1,
        totalPages: 1,
        totalBlogs: 0,
        blogs: [],
        message: data.message || 'Không thể tải danh sách bài viết.',
      };
    }

    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.pages || 1,
      totalBlogs: data.total || 0,
      blogs: data.data || [],
    };
  } catch (error) {
    console.error('getBlogsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalBlogs: 0,
      blogs: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function createBlogAction(blogData: {
  title: string;
  content: string;
  summary: string;
  category: string;
  featuredImage: string;
  status: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo bài viết thất bại.' };
    }

    return { success: true, message: 'Đã tạo bài viết thành công!', data: data.data };
  } catch (error) {
    console.error('createBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateBlogAction(
  id: string,
  blogData: Record<string, any>,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật bài viết thất bại.' };
    }

    return { success: true, message: 'Đã cập nhật bài viết thành công!', data: data.data };
  } catch (error) {
    console.error('updateBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function toggleBlogStatusAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'PATCH',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Thay đổi trạng thái bài viết thất bại.' };
    }

    return { success: true, message: data.message || 'Đã thay đổi trạng thái bài viết thành công!' };
  } catch (error) {
    console.error('toggleBlogStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteBlogAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa bài viết thất bại.' };
    }

    return { success: true, message: data.message || 'Đã xóa bài viết thành công!' };
  } catch (error) {
    console.error('deleteBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
