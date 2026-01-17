import api from './api';

/**
 * Order Service
 */
export const orderService = {
  // Create new order
  create: async (orderData) => {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAll: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  // Update order status (Admin only)
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export default orderService;
