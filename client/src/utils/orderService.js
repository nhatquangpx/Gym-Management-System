import axios from './axiosConfig';

// Lấy danh sách tất cả đơn hàng (chỉ admin)
export const getAllOrders = async () => {
  try {
    const response = await axios.get('/api/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng của người dùng hiện tại
export const getUserOrders = async () => {
  try {
    const response = await axios.get('/api/orders/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một đơn hàng
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

// Tạo đơn hàng mới
export const createManualOrder = async (orderData) => {
  try {
    const response = await axios.post('/api/orders/manual', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng (chỉ admin)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status with id ${id}:`, error);
    throw error;
  }
}; 