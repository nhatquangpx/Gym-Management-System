import axios from './axiosConfig';

// Lấy danh sách tất cả thiết bị
export const getAllEquipments = async () => {
  try {
    const response = await axios.get('/api/equipments');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một thiết bị
export const getEquipmentById = async (id) => {
  try {
    const response = await axios.get(`/api/equipments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with id ${id}:`, error);
    throw error;
  }
};

// Tạo thiết bị mới
export const createEquipment = async (equipmentData) => {
  try {
    const response = await axios.post('/api/equipments', equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

// Cập nhật thông tin thiết bị
export const updateEquipment = async (id, equipmentData) => {
  try {
    const response = await axios.put(`/api/equipments/${id}`, equipmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment with id ${id}:`, error);
    throw error;
  }
};

// Xóa thiết bị
export const deleteEquipment = async (id) => {
  try {
    const response = await axios.delete(`/api/equipments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting equipment with id ${id}:`, error);
    throw error;
  }
}; 