import axios from './axiosConfig';

// Lấy danh sách tất cả các gói tập
export const getAllPackages = async () => {
  try {
    const response = await axios.get('/api/packages');
    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một gói tập
export const getPackageById = async (id) => {
  try {
    const response = await axios.get(`/api/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching package with id ${id}:`, error);
    throw error;
  }
};

// Tạo gói tập mới (yêu cầu quyền admin)
export const createPackage = async (packageData) => {
  try {
    const response = await axios.post('/api/packages', packageData);
    return response.data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

// Cập nhật thông tin gói tập (yêu cầu quyền admin)
export const updatePackage = async (id, packageData) => {
  try {
    const response = await axios.put(`/api/packages/${id}`, packageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating package with id ${id}:`, error);
    throw error;
  }
};

// Xóa gói tập (yêu cầu quyền admin)
export const deletePackage = async (id) => {
  try {
    const response = await axios.delete(`/api/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting package with id ${id}:`, error);
    throw error;
  }
}; 